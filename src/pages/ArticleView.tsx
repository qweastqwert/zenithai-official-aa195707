
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp, ThumbsDown, User, Calendar, ArrowLeft } from 'lucide-react';
import { resources } from '@/data/resources';
import { useToast } from '@/hooks/use-toast';

const ArticleView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [helpful, setHelpful] = useState(0);
  const [notHelpful, setNotHelpful] = useState(0);

  const article = resources.find(r => r.id === id);

  React.useEffect(() => {
    if (article) {
      setHelpful(article.helpful);
      setNotHelpful(article.notHelpful);
      
      // Check if user has already voted
      const votedResources = JSON.parse(localStorage.getItem('zenith-voted-resources') || '[]');
      if (votedResources.includes(article.id)) {
        setHasVoted(true);
      }
    }
  }, [article]);

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Link to="/resources">
              <Button>Back to Resources</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleVote = (isHelpfulVote: boolean) => {
    if (hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already voted on this resource.",
        variant: "destructive",
      });
      return;
    }

    if (isHelpfulVote) {
      setHelpful(prev => prev + 1);
      toast({
        title: "Thank you! 👍",
        description: "Your feedback helps us improve our resources.",
      });
    } else {
      setNotHelpful(prev => prev + 1);
      toast({
        title: "Thank you for your feedback",
        description: "We'll work on improving our content.",
      });
    }
    
    setHasVoted(true);
    
    // Store vote in localStorage
    const votedResources = JSON.parse(localStorage.getItem('zenith-voted-resources') || '[]');
    votedResources.push(article.id);
    localStorage.setItem('zenith-voted-resources', JSON.stringify(votedResources));
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">{paragraph.slice(3)}</h2>;
      } else if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">{paragraph.slice(4)}</h3>;
      } else if (paragraph.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-1 text-gray-700 dark:text-gray-300 list-disc">{paragraph.slice(2)}</li>;
      } else if (paragraph.trim() && !paragraph.startsWith('#')) {
        return <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{paragraph}</p>;
      }
      return null;
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/resources" className="inline-flex items-center gap-2 text-zenith-purple hover:text-zenith-darkpurple mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
          
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-zenith-purple text-white">
                {article.category}
              </Badge>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {article.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {formatContent(article.content)}
              </div>
              
              <div className="border-t pt-8 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Was this article helpful?
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant={hasVoted ? "secondary" : "outline"}
                    onClick={() => handleVote(true)}
                    disabled={hasVoted}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Yes, helpful ({helpful})
                  </Button>
                  <Button
                    variant={hasVoted ? "secondary" : "outline"}
                    onClick={() => handleVote(false)}
                    disabled={hasVoted}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Not helpful ({notHelpful})
                  </Button>
                </div>
                {hasVoted && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Thank you for your feedback! 🙏
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArticleView;
