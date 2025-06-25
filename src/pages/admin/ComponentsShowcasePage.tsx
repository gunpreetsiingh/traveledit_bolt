import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SliderWithInputDemo } from '@/components/ui/slider-with-input-demo';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  CheckCircle, 
  Palette, 
  Heart, 
  Star, 
  MapPin, 
  Calendar as CalendarIcon,
  User,
  Settings,
  Home,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Share,
  Filter,
  SortAsc,
  MoreHorizontal
} from 'lucide-react';

export default function ComponentsShowcasePage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [date, setDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Components currently in use in the application
  const inUseComponents = [
    'Button',
    'Input', 
    'Label',
    'Textarea',
    'Card',
    'Badge',
    'Avatar',
    'Select',
    'Slider',
    'Separator',
    'Tabs',
    'Dialog',
    'Popover',
    'Calendar',
    'ScrollArea',
    'ToggleGroup'
  ];

  return (
    <div className="pt-20 pb-8">
      <div className="container-spacing">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-heading font-semibold">Component Library</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Components currently in use across the application
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              In Use
            </Badge>
            <span className="text-sm text-muted-foreground">
              {inUseComponents.length} components actively used
            </span>
          </div>
        </div>

        {/* Components Grid */}
        <div className="space-y-16">
          
          {/* Buttons */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Button</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Primary button styles used throughout the app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Heart className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Form Components */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Form Components</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input & Label</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter password" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Textarea</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Type your message here..." />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Select */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Select</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Select Dropdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-w-xs">
                  <Label>Choose an option</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Slider Comparison */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Slider</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Slider</CardTitle>
                  <CardDescription>Basic slider component currently in use</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Value: {sliderValue[0]}</Label>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Slider with Input</CardTitle>
                  <CardDescription>Enhanced slider with input fields for precise control</CardDescription>
                </CardHeader>
                <CardContent>
                  <SliderWithInputDemo />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Cards & Badges */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Cards & Badges</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Card</CardTitle>
                  <CardDescription>This is a card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards are used throughout the app for content containers.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Badge Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Avatar */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Avatar</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Avatar Component</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tabs */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Tabs</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Tab Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tab1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="mt-4">
                    <p className="text-sm text-muted-foreground">Content for tab 1</p>
                  </TabsContent>
                  <TabsContent value="tab2" className="mt-4">
                    <p className="text-sm text-muted-foreground">Content for tab 2</p>
                  </TabsContent>
                  <TabsContent value="tab3" className="mt-4">
                    <p className="text-sm text-muted-foreground">Content for tab 3</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Toggle Group */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Toggle Group</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Toggle Group</CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleGroup type="single" defaultValue="center">
                  <ToggleGroupItem value="left">
                    <Home className="h-4 w-4 mr-2" />
                    Left
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center">
                    <Search className="h-4 w-4 mr-2" />
                    Center
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right">
                    <Settings className="h-4 w-4 mr-2" />
                    Right
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>
          </section>

          {/* Dialog & Popover */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Dialog & Popover</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                </CardHeader>
                <CardContent>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sample Dialog</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          This is a sample dialog content.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popover</CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Open Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Popover Content</h4>
                        <p className="text-sm text-muted-foreground">
                          This is popover content with some information.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Calendar */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Calendar</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Date Picker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Scroll Area */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Scroll Area</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Scrollable Content</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 w-full border rounded p-4">
                  <div className="space-y-2">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="text-sm">
                        Scrollable item {i + 1}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          {/* Separator */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-heading font-semibold">Separator</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                In Use
              </Badge>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Content Dividers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">Content above separator</p>
                  <Separator />
                  <p className="text-sm">Content below separator</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">Left content</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm">Right content</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}