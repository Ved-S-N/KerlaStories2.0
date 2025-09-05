import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, MicOff, Bot, User, Globe, Volume2, VolumeX } from 'lucide-react';

const quickQuestions = [
  'What crops are suitable for Kerala monsoon season?',
  'How to apply for PM-KISAN scheme?',
  'Best organic fertilizers for coconut trees',
  'Crop insurance claim process',
  'Weather forecast for next week',
  'Market prices for rice and spices'
];

const chatHistory = [
  {
    type: 'bot',
    message: 'Namaskaram! I am your AI agricultural assistant. I can help you in English and Malayalam. How can I assist you today?',
    time: '10:30 AM'
  },
  {
    type: 'user', 
    message: 'What are the best practices for coconut farming in Kerala?',
    time: '10:31 AM'
  },
  {
    type: 'bot',
    message: 'For coconut farming in Kerala, here are the key practices:\n\n1. **Soil Preparation**: Well-drained sandy loam soil with pH 5.2-8.0\n2. **Planting**: Plant during monsoon (June-September)\n3. **Spacing**: 7.5m x 7.5m for dwarf varieties\n4. **Irrigation**: Regular watering during dry season\n5. **Fertilization**: Apply organic manure and NPK fertilizers\n\nWould you like more specific information about any of these practices?',
    time: '10:32 AM'
  }
];

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('english');
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      // Add message sending logic here
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            AI Agricultural Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get instant help with farming, schemes, weather, and more. 
            Bilingual support in English and Malayalam with voice interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card h-[600px] flex flex-col">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center animate-glow">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Agricultural AI Assistant</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={language === 'english' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('english')}
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      EN
                    </Button>
                    <Button
                      variant={language === 'malayalam' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('malayalam')}
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      ML
                    </Button>
                    <Button
                      variant={audioEnabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${chat.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        chat.type === 'user' ? 'bg-primary' : 'bg-gradient-primary'
                      }`}>
                        {chat.type === 'user' ? 
                          <User className="h-4 w-4 text-primary-foreground" /> : 
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        }
                      </div>
                      <div className={`rounded-lg px-4 py-3 ${
                        chat.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{chat.message}</p>
                        <p className="text-xs opacity-70 mt-1">{chat.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'english' ? 'Ask me anything about farming...' : 'കൃഷിയെക്കുറിച്ച് എന്തെങ്കിലും ചോദിക്കൂ...'}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleSend} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3 text-sm hover:bg-muted"
                    onClick={() => setMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">AI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">✨</Badge>
                  <span className="text-sm">Scheme Recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">🌦️</Badge>
                  <span className="text-sm">Weather Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">📊</Badge>
                  <span className="text-sm">Market Prices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">🌱</Badge>
                  <span className="text-sm">Crop Advice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">🎯</Badge>
                  <span className="text-sm">Bilingual Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">🎤</Badge>
                  <span className="text-sm">Voice Interaction</span>
                </div>
              </CardContent>
            </Card>

            {/* Gemini Integration Notice */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">Powered by Gemini AI</h4>
                <p className="text-xs opacity-90">
                  Advanced language model for accurate agricultural guidance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}