import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Trash2, 
  MapPin, 
  Calendar, 
  User, 
  AlertCircle,
  Heart,
  Eye,
  Plus,
  Clock,
  CheckSquare
} from 'lucide-react';

interface SystemActivity {
  id: string;
  type: 'saved' | 'created' | 'flagged';
  message: string;
  timestamp: Date;
  canOverride: boolean;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: 'client' | 'advisor';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date;
}

interface InspirationPin {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  tags: string[];
  createdBy: 'llm' | 'advisor';
}

export default function ChatRightSidebar() {
  const [systemActivities, setSystemActivities] = useState<SystemActivity[]>([
    {
      id: '1',
      type: 'saved',
      message: 'Saved to Wishlist → Greece',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      canOverride: true
    },
    {
      id: '2',
      type: 'created',
      message: 'Created Pin → Santorini Sunset Experience',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      canOverride: true
    },
    {
      id: '3',
      type: 'flagged',
      message: 'Unable to identify → Flagged for review',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      canOverride: true
    }
  ]);

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      task: 'Client asked for budget hotels in Florence',
      assignee: 'advisor',
      priority: 'medium',
      completed: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      task: 'Advisor to confirm flights for Japan',
      assignee: 'advisor',
      priority: 'high',
      completed: false,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      task: 'Review travel insurance options',
      assignee: 'client',
      priority: 'low',
      completed: true
    }
  ]);

  const [inspirationPins, setInspirationPins] = useState<InspirationPin[]>([
    {
      id: '1',
      title: 'Santorini Sunset Experience',
      description: 'Private sunset dinner at a cliffside restaurant in Oia',
      image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Santorini, Greece',
      tags: ['luxury', 'romantic', 'dining'],
      createdBy: 'llm'
    },
    {
      id: '2',
      title: 'Mykonos Beach Club',
      description: 'Exclusive beach club experience with crystal clear waters',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Mykonos, Greece',
      tags: ['beach', 'luxury', 'relaxation'],
      createdBy: 'llm'
    }
  ]);

  const handleActivityOverride = (id: string, action: 'approve' | 'reject') => {
    setSystemActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const toggleActionItem = (id: string) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getActivityIcon = (type: SystemActivity['type']) => {
    switch (type) {
      case 'saved':
        return <Heart className="h-4 w-4 text-green-500" />;
      case 'created':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'flagged':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* System Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">System Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {systemActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {activity.canOverride && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleActivityOverride(activity.id, 'approve')}
                  >
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleActivityOverride(activity.id, 'reject')}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {systemActivities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Action Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actionItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 mt-0.5"
                  onClick={() => toggleActionItem(item.id)}
                >
                  {item.completed ? (
                    <CheckSquare className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 border-2 border-muted-foreground rounded" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.task}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.assignee}
                    </Badge>
                    {item.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {item.dueDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inspiration Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Inspiration Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inspirationPins.map((pin) => (
            <div key={pin.id} className="border rounded-lg overflow-hidden">
              <img 
                src={pin.image} 
                alt={pin.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h4 className="font-medium text-sm mb-1">{pin.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{pin.description}</p>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{pin.location}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pin.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Pin
                  </Button>
                  <Button size="sm" className="flex-1 text-xs">
                    Assign to Trip
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}