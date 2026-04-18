import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, Heart, ThumbsDown, User, Calendar, ArrowLeft, Share2, Bookmark, BookmarkCheck, Eye } from 'lucide-react';
import { resources } from '@/data/resources';
import { useToast } from '@/hooks/use-toast';

const STORAGE_LIKES = 'zenith-article-likes';
const STORAGE_VOTED = 'zenith-voted-resources';
const STORAGE_BOOKMARKS = 'zenith-bookmarked-articles';
const STORAGE_VIEWS = 'zenith-article-views';

const getStored = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; } catch { return fallback; }
};

const ArticleView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [notHelpful, setNotHelpful] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [views, setViews] = useState(0);

  const article = resources.find((r) => r.id === id);

  useEffect(() => {
    if (!article) return;
    // Likes — persistent across reloads
    const allLikes = getStored<Record<string, number>>(STORAGE_LIKES, {});
    const stored = allLikes[article.id];
    setLikes(stored ?? article.helpful);
    const voted = getStored<string[]>(STORAGE_VOTED, []);
    if (voted.includes(article.id)) {
      setHasVoted(true);
      setHasLiked(true);
    }
    setNotHelpful(article.notHelpful);

    // Bookmarks
    const bm = getStored<string[]>(STORAGE_BOOKMARKS, []);
    setBookmarked(bm.includes(article.id));

    // Views — increment once per session
    const allViews = getStored<Record<string, number>>(STORAGE_VIEWS, {});
    const sessionKey = `viewed-${article.id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      allViews[article.id] = (allViews[article.id] ?? Math.floor(Math.random() * 200) + 50) + 1;
      localStorage.setItem(STORAGE_VIEWS, JSON.stringify(allViews));
      sessionStorage.setItem(sessionKey, '1');
    }
    setViews(allViews[article.id] ?? 0);
  }, [article]);

  const readingTime = useMemo(() => {
    if (!article) return 0;
    return Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
  }, [article]);

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Link to="/resources"><Button>Back to Resources</Button></Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    if (hasLiked) {
      toast({ title: 'Already liked', description: 'Thanks for your support! 💜' });
      return;
    }
    const next = likes + 1;
    setLikes(next);
    setHasLiked(true);
    setHasVoted(true);

    const allLikes = getStored<Record<string, number>>(STORAGE_LIKES, {});
    allLikes[article.id] = next;
    localStorage.setItem(STORAGE_LIKES, JSON.stringify(allLikes));

    const voted = getStored<string[]>(STORAGE_VOTED, []);
    if (!voted.includes(article.id)) voted.push(article.id);
    localStorage.setItem(STORAGE_VOTED, JSON.stringify(voted));

    toast({ title: 'Thanks for the love! ❤️', description: 'Your like helps others find this article.' });
  };

  const handleNotHelpful = () => {
    if (hasVoted) return;
    setNotHelpful((p) => p + 1);
    setHasVoted(true);
    const voted = getStored<string[]>(STORAGE_VOTED, []);
    voted.push(article.id);
    localStorage.setItem(STORAGE_VOTED, JSON.stringify(voted));
    toast({ title: 'Thanks for the feedback', description: "We'll keep working to improve." });
  };

  const handleBookmark = () => {
    const bm = getStored<string[]>(STORAGE_BOOKMARKS, []);
    const next = bookmarked ? bm.filter((x) => x !== article.id) : [...bm, article.id];
    localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(next));
    setBookmarked(!bookmarked);
    toast({ title: bookmarked ? 'Bookmark removed' : 'Bookmarked', description: bookmarked ? 'Removed from your saved list.' : 'Find it in your saved articles.' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.description, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Share it with someone who needs it.' });
      }
    } catch { /* user cancelled */ }
  };

  const formatContent = (content: string) => {
    const blocks: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    const flushList = (key: string) => {
      if (listBuffer.length) {
        blocks.push(
          <ul key={`list-${key}`} className="my-4 space-y-2 pl-1">
            {listBuffer.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 items-start group"
              >
                <span className="mt-2 inline-block w-2 h-2 rounded-full bg-primary/70 group-hover:bg-primary transition-colors flex-shrink-0" />
                <span className="text-foreground/85 leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    content.split('\n').forEach((paragraph, index) => {
      if (paragraph.startsWith('- ')) {
        listBuffer.push(paragraph.slice(2));
        return;
      }
      flushList(String(index));
      if (paragraph.startsWith('## ')) {
        blocks.push(
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mt-8 mb-3 text-foreground flex items-center gap-2"
          >
            <span className="inline-block w-1 h-7 bg-primary rounded-full" />
            {paragraph.slice(3)}
          </motion.h2>
        );
      } else if (paragraph.startsWith('### ')) {
        blocks.push(
          <h3 key={index} className="text-xl font-semibold mt-5 mb-2 text-foreground/90">{paragraph.slice(4)}</h3>
        );
      } else if (paragraph.trim() && !paragraph.startsWith('#')) {
        blocks.push(
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-4 text-foreground/80 leading-relaxed"
          >
            {paragraph}
          </motion.p>
        );
      }
    });
    flushList('end');
    return blocks;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/resources" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Resources
            </Link>
          </motion.div>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="overflow-hidden border-border/60 shadow-lg">
              <div className="relative">
                <motion.img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 sm:h-80 object-cover"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground capitalize shadow-lg">
                  {article.category}
                </Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleBookmark}
                    className="rounded-full backdrop-blur-md bg-white/80 hover:bg-white shadow-md"
                    aria-label="Bookmark"
                  >
                    {bookmarked
                      ? <BookmarkCheck className="h-4 w-4 text-primary fill-primary/20" />
                      : <Bookmark className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleShare}
                    className="rounded-full backdrop-blur-md bg-white/80 hover:bg-white shadow-md"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> <span>{readingTime} min read</span></div>
                  <div className="flex items-center gap-1.5"><User className="h-4 w-4" /> <span>{article.author}</span></div>
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> <span>{new Date(article.publishedAt).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> <span>{views.toLocaleString()} views</span></div>
                  <div className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500" /> <span>{likes.toLocaleString()} likes</span></div>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl font-bold mb-4 text-foreground leading-tight"
                >
                  {article.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground mb-6 leading-relaxed"
                >
                  {article.description}
                </motion.p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                    >
                      <Badge variant="outline" className="text-sm hover:bg-primary/5 hover:border-primary/40 transition-colors cursor-default">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {formatContent(article.content)}
                </div>

                {/* Like / feedback section */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border-t border-border/60 pt-8 mt-10"
                >
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Did this resonate with you?</h3>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <motion.div whileTap={{ scale: 0.92 }}>
                      <Button
                        onClick={handleLike}
                        variant={hasLiked ? 'default' : 'outline'}
                        className={`flex items-center gap-2 rounded-full transition-all ${hasLiked ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'hover:border-rose-300 hover:text-rose-600'}`}
                      >
                        <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current animate-pulse' : ''}`} />
                        {hasLiked ? 'Liked' : 'Like'} · {likes.toLocaleString()}
                      </Button>
                    </motion.div>
                    <Button
                      variant="outline"
                      onClick={handleNotHelpful}
                      disabled={hasVoted}
                      className="flex items-center gap-2 rounded-full"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Not for me ({notHelpful})
                    </Button>
                    <Button variant="ghost" onClick={handleShare} className="flex items-center gap-2 rounded-full ml-auto">
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                  {hasLiked && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-rose-600 dark:text-rose-400"
                    >
                      Thank you — your support means a lot 🙏
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </Card>
          </motion.article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArticleView;
