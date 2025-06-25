import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move, 
  Eye, 
  Save, 
  Copy,
  Image as ImageIcon,
  Palette,
  Type,
  Layout,
  Settings,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface QuestionnaireQuestion {
  id: string;
  type: 'single_select' | 'multi_select' | 'text' | 'slider' | 'boolean';
  prompt: string;
  options?: string[];
  required: boolean;
  order: number;
  min_value?: number;
  max_value?: number;
  unit?: string;
}

interface QuestionnairePage {
  id: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  questions: QuestionnaireQuestion[];
  order: number;
}

interface QuestionnaireTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export default function QuestionnaireBuilderPage() {
  const [pages, setPages] = useState<QuestionnairePage[]>([
    {
      id: '1',
      title: 'When booking lodging, what\'s most important to you?',
      backgroundImage: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600',
      backgroundColor: '#5F6E4E',
      textColor: '#FFFFFF',
      order: 1,
      questions: [
        {
          id: 'q1',
          type: 'single_select',
          prompt: 'What type of lodging do you prefer for most of your trips?',
          options: [
            'Luxury accommodations with premium amenities and services',
            'Comfortable mid-range options with good value for money',
            'Budget friendly options that meet basic needs',
            'Unique or boutique accommodations with character'
          ],
          required: false,
          order: 1
        },
        {
          id: 'q2',
          type: 'multi_select',
          prompt: 'Must-have Amenities',
          options: ['A/C', 'Elevator', 'Pool', 'Breakfast', 'Room Service', 'Resort', 'All Inclusive', 'Oceanview'],
          required: false,
          order: 2
        },
        {
          id: 'q3',
          type: 'slider',
          prompt: 'Budget Range - Per Person/Per Night',
          required: false,
          order: 3,
          min_value: 50,
          max_value: 350,
          unit: '$'
        },
        {
          id: 'q4',
          type: 'text',
          prompt: 'Anything else you want us to know',
          required: false,
          order: 4
        }
      ]
    }
  ]);

  const [selectedPageId, setSelectedPageId] = useState<string>('1');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [isPropertiesPanelCollapsed, setIsPropertiesPanelCollapsed] = useState(false);

  // Preview selections state for interactive questions
  const [previewSelections, setPreviewSelections] = useState<Record<string, any>>({});

  const [theme, setTheme] = useState<QuestionnaireTheme>({
    primaryColor: '#5F6E4E',
    secondaryColor: '#D7C3AE',
    accentColor: '#C27C6C',
    backgroundColor: '#FAFAF8',
    textColor: '#2E2E2E',
    fontFamily: 'Inter'
  });

  const selectedPage = pages.find(page => page.id === selectedPageId);
  const currentPageIndex = pages.findIndex(page => page.id === selectedPageId);

  // Separate first question from remaining questions
  const firstQuestion = selectedPage?.questions[0];
  const remainingQuestions = selectedPage?.questions.slice(1) || [];

  // Handler functions for interactive questions with DEBUG LOGS
  const handleSelectOption = (questionId: string, option: string) => {
    console.log('🔵 handleSelectOption called:', { questionId, option });
    console.log('🔵 Current previewSelections before update:', previewSelections);
    
    setPreviewSelections(prev => {
      const newState = { ...prev, [questionId]: option };
      console.log('🔵 New previewSelections state:', newState);
      return newState;
    });
  };

  const handleToggleMultiSelect = (questionId: string, option: string) => {
    console.log('🟡 handleToggleMultiSelect called:', { questionId, option });
    console.log('🟡 Current previewSelections before update:', previewSelections);
    
    setPreviewSelections(prev => {
      const current = prev[questionId] || [];
      console.log('🟡 Current selection for question:', current);
      
      const updated = current.includes(option)
        ? current.filter((item: string) => item !== option)
        : [...current, option];
      
      const newState = { ...prev, [questionId]: updated };
      console.log('🟡 Updated selection:', updated);
      console.log('🟡 New previewSelections state:', newState);
      return newState;
    });
  };

  const handleSliderChange = (questionId: string, value: number[]) => {
    console.log('🟢 handleSliderChange called:', { questionId, value });
    console.log('🟢 Current previewSelections before update:', previewSelections);
    
    setPreviewSelections(prev => {
      const newState = { ...prev, [questionId]: value[0] };
      console.log('🟢 New previewSelections state:', newState);
      return newState;
    });
  };

  const handleTextChange = (questionId: string, value: string) => {
    console.log('🟣 handleTextChange called:', { questionId, value });
    console.log('🟣 Current previewSelections before update:', previewSelections);
    
    setPreviewSelections(prev => {
      const newState = { ...prev, [questionId]: value };
      console.log('🟣 New previewSelections state:', newState);
      return newState;
    });
  };

  const handleBooleanChange = (questionId: string, value: boolean) => {
    console.log('🔴 handleBooleanChange called:', { questionId, value });
    console.log('🔴 Current previewSelections before update:', previewSelections);
    
    setPreviewSelections(prev => {
      const newState = { ...prev, [questionId]: value };
      console.log('🔴 New previewSelections state:', newState);
      return newState;
    });
  };

  const handleAddPage = () => {
    const newPage: QuestionnairePage = {
      id: Date.now().toString(),
      title: 'New Page',
      subtitle: 'Page subtitle',
      backgroundColor: theme.primaryColor,
      textColor: '#FFFFFF',
      order: pages.length + 1,
      questions: []
    };
    setPages([...pages, newPage]);
    setSelectedPageId(newPage.id);
    setIsAddPageDialogOpen(false);
  };

  const handleAddQuestion = (type: QuestionnaireQuestion['type']) => {
    if (!selectedPage) return;

    const newQuestion: QuestionnaireQuestion = {
      id: Date.now().toString(),
      type,
      prompt: 'New question prompt',
      options: type === 'single_select' || type === 'multi_select' ? ['Option 1', 'Option 2'] : undefined,
      required: false,
      order: selectedPage.questions.length + 1,
      min_value: type === 'slider' ? 0 : undefined,
      max_value: type === 'slider' ? 100 : undefined,
      unit: type === 'slider' ? '$' : undefined
    };

    setPages(pages.map(page => 
      page.id === selectedPageId 
        ? { ...page, questions: [...page.questions, newQuestion] }
        : page
    ));
    setSelectedQuestionId(newQuestion.id);
    setIsAddQuestionDialogOpen(false);
  };

  const handleUpdatePage = (updates: Partial<QuestionnairePage>) => {
    setPages(pages.map(page => 
      page.id === selectedPageId 
        ? { ...page, ...updates }
        : page
    ));
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuestionnaireQuestion>) => {
    setPages(pages.map(page => 
      page.id === selectedPageId 
        ? {
            ...page,
            questions: page.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        : page
    ));
  };

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(page => page.id !== pageId));
    if (selectedPageId === pageId && pages.length > 1) {
      setSelectedPageId(pages.find(page => page.id !== pageId)?.id || '');
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setPages(pages.map(page => 
      page.id === selectedPageId 
        ? { ...page, questions: page.questions.filter(q => q.id !== questionId) }
        : page
    ));
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setSelectedPageId(pages[currentPageIndex - 1].id);
      setSelectedQuestionId(null);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setSelectedPageId(pages[currentPageIndex + 1].id);
      setSelectedQuestionId(null);
    }
  };

  const questionTypes = [
    { value: 'single_select', label: 'Single Choice', description: 'User selects one option' },
    { value: 'multi_select', label: 'Multiple Choice', description: 'User selects multiple options' },
    { value: 'text', label: 'Text Input', description: 'User enters text' },
    { value: 'slider', label: 'Slider', description: 'User selects a value on a range' },
    { value: 'boolean', label: 'Yes/No', description: 'User selects yes or no' }
  ];

  // Render question component for reuse with DEBUG LOGS
  const renderQuestionInput = (question: QuestionnaireQuestion, size: 'sm' | 'lg' = 'sm') => {
    const selectedValue = previewSelections[question.id];
    
    console.log(`🎯 renderQuestionInput called for question ${question.id}:`, {
      questionType: question.type,
      selectedValue,
      size,
      allPreviewSelections: previewSelections
    });

    switch (question.type) {
      case 'single_select':
        console.log(`🔵 Rendering single_select for ${question.id}:`, {
          options: question.options,
          selectedValue,
          hasOptions: !!question.options
        });
        
        return question.options && (
          <div className="space-y-1">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedValue === option;
              console.log(`🔵 Single select option "${option}":`, {
                isSelected,
                selectedValue,
                variant: isSelected ? "default" : "outline"
              });
              
              return (
                <Button
                  key={optionIndex}
                  variant={isSelected ? "default" : "outline"}
                  size={size}
                  className={`w-full justify-start text-left h-auto ${size === 'lg' ? 'p-2 text-xs' : 'p-1 text-xs'}`}
                  onClick={() => {
                    console.log(`🔵 Button clicked for option: "${option}"`);
                    handleSelectOption(question.id, option);
                  }}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        );

      case 'multi_select':
        console.log(`🟡 Rendering multi_select for ${question.id}:`, {
          options: question.options,
          selectedValue,
          hasOptions: !!question.options
        });
        
        return question.options && (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedValue?.includes(option);
                console.log(`🟡 Multi select option "${option}":`, {
                  isSelected,
                  selectedValue,
                  variant: isSelected ? "default" : "outline"
                });
                
                return (
                  <Badge
                    key={optionIndex}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-muted-foreground/10'
                    }`}
                    onClick={() => {
                      console.log(`🟡 Badge clicked for option: "${option}"`);
                      handleToggleMultiSelect(question.id, option);
                    }}
                  >
                    {option}
                  </Badge>
                );
              })}
            </div>
          </div>
        );

      case 'slider':
        const minValue = question.min_value || 0;
        const maxValue = question.max_value || 100;
        const currentValue = selectedValue || Math.round((maxValue - minValue) * 0.6 + minValue);
        
        console.log(`🟢 Rendering slider for ${question.id}:`, {
          minValue,
          maxValue,
          currentValue,
          selectedValue,
          sliderValue: [currentValue]
        });
        
        return (
          <div className="space-y-2">
            <Slider
              value={[currentValue]}
              onValueChange={(value) => {
                console.log(`🟢 Slider value changed:`, value);
                handleSliderChange(question.id, value);
              }}
              min={minValue}
              max={maxValue}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{question.unit}{minValue}</span>
              <span className="font-medium text-primary">{question.unit}{currentValue}</span>
              <span>{question.unit}{maxValue}</span>
            </div>
          </div>
        );

      case 'text':
        console.log(`🟣 Rendering text for ${question.id}:`, {
          selectedValue,
          textValue: selectedValue || ''
        });
        
        return (
          <Textarea
            placeholder="Tell us about any specific preferences, requirements, or special requests..."
            value={selectedValue || ''}
            onChange={(e) => {
              console.log(`🟣 Textarea value changed:`, e.target.value);
              handleTextChange(question.id, e.target.value);
            }}
            className={`w-full resize-none ${size === 'lg' ? 'text-sm p-2 min-h-[80px]' : 'text-xs p-2 min-h-[50px]'}`}
            rows={size === 'lg' ? 3 : 2}
          />
        );

      case 'boolean':
        console.log(`🔴 Rendering boolean for ${question.id}:`, {
          selectedValue,
          trueSelected: selectedValue === true,
          falseSelected: selectedValue === false
        });
        
        return (
          <div className="flex gap-1">
            <Badge
              variant={selectedValue === true ? "default" : "outline"}
              className={`cursor-pointer flex-1 justify-center transition-all duration-200 hover:scale-105 ${
                selectedValue === true 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-muted-foreground/10'
              }`}
              onClick={() => {
                console.log(`🔴 Yes badge clicked`);
                handleBooleanChange(question.id, true);
              }}
            >
              Yes
            </Badge>
            <Badge
              variant={selectedValue === false ? "default" : "outline"}
              className={`cursor-pointer flex-1 justify-center transition-all duration-200 hover:scale-105 ${
                selectedValue === false 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-muted-foreground/10'
              }`}
              onClick={() => {
                console.log(`🔴 No badge clicked`);
                handleBooleanChange(question.id, false);
              }}
            >
              No
            </Badge>
          </div>
        );

      default:
        console.log(`❌ Unknown question type: ${question.type}`);
        return null;
    }
  };

  // Add a debug log for the overall component state
  console.log('📊 QuestionnaireBuilderPage render:', {
    selectedPageId,
    selectedQuestionId,
    previewSelections,
    firstQuestion: firstQuestion?.id,
    remainingQuestions: remainingQuestions.map(q => q.id)
  });

  return (
    <div className="pt-20 bg-background">
      {/* Scrollable Content */}
      <div className="pb-12">
        {/* Top Toolbar - Now Scrollable */}
        <div className="border-b p-2 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-heading font-semibold">Questionnaire Builder</h1>
              {selectedPage && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Page {currentPageIndex + 1} of {pages.length}: {selectedPage.title}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPageIndex === 0}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPageIndex === pages.length - 1}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Preview Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  className="h-6 w-6 p-0"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  className="h-6 w-6 p-0"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  className="h-6 w-6 p-0"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-3 w-3" />
                </Button>
              </div>
              <Dialog open={isAddPageDialogOpen} onOpenChange={setIsAddPageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Page
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Page</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input placeholder="Enter page title..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle (Optional)</Label>
                      <Input placeholder="Enter page subtitle..." />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddPageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPage}>
                        Add Page
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button size="sm">
                <Save className="h-3 w-3 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Panel - Collapsible */}
        <div className={`border-b bg-card transition-all duration-300 ${isPropertiesPanelCollapsed ? 'h-10' : 'h-48'}`}>
          <div className="flex items-center justify-between p-2 border-b">
            <h2 className="text-base font-heading font-semibold">Properties</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPropertiesPanelCollapsed(!isPropertiesPanelCollapsed)}
            >
              {isPropertiesPanelCollapsed ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
            </Button>
          </div>
          
          {!isPropertiesPanelCollapsed && (
            <div className="h-40 overflow-hidden">
              <Tabs defaultValue="page" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 mx-2 mt-1">
                  <TabsTrigger value="page" className="text-xs">Page</TabsTrigger>
                  <TabsTrigger value="question" className="text-xs">Question</TabsTrigger>
                  <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="page" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-2 space-y-3">
                        {selectedPage && (
                          <>
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium flex items-center gap-1">
                                <Type className="h-3 w-3" />
                                Content
                              </h3>
                              <div className="grid grid-cols-2 gap-1">
                                <div>
                                  <Label className="text-xs">Page Title</Label>
                                  <Input
                                    value={selectedPage.title}
                                    onChange={(e) => handleUpdatePage({ title: e.target.value })}
                                    className="text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Subtitle</Label>
                                  <Input
                                    value={selectedPage.subtitle || ''}
                                    onChange={(e) => handleUpdatePage({ subtitle: e.target.value })}
                                    placeholder="Optional subtitle"
                                    className="text-xs"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-sm font-medium flex items-center gap-1">
                                <Palette className="h-3 w-3" />
                                Styling
                              </h3>
                              <div className="grid grid-cols-3 gap-1">
                                <div>
                                  <Label className="text-xs">Background Color</Label>
                                  <div className="flex gap-1">
                                    <Input
                                      type="color"
                                      value={selectedPage.backgroundColor || '#5F6E4E'}
                                      onChange={(e) => handleUpdatePage({ backgroundColor: e.target.value })}
                                      className="w-8 h-6 p-1"
                                    />
                                    <Input
                                      value={selectedPage.backgroundColor || '#5F6E4E'}
                                      onChange={(e) => handleUpdatePage({ backgroundColor: e.target.value })}
                                      placeholder="#5F6E4E"
                                      className="flex-1 text-xs"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs">Text Color</Label>
                                  <div className="flex gap-1">
                                    <Input
                                      type="color"
                                      value={selectedPage.textColor || '#FFFFFF'}
                                      onChange={(e) => handleUpdatePage({ textColor: e.target.value })}
                                      className="w-8 h-6 p-1"
                                    />
                                    <Input
                                      value={selectedPage.textColor || '#FFFFFF'}
                                      onChange={(e) => handleUpdatePage({ textColor: e.target.value })}
                                      placeholder="#FFFFFF"
                                      className="flex-1 text-xs"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs">Background Image URL</Label>
                                  <Input
                                    value={selectedPage.backgroundImage || ''}
                                    onChange={(e) => handleUpdatePage({ backgroundImage: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="text-xs"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-sm font-medium flex items-center gap-1">
                                <Settings className="h-3 w-3" />
                                Actions
                              </h3>
                              <div className="flex gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    const newPage = { ...selectedPage, id: Date.now().toString(), title: `${selectedPage.title} (Copy)` };
                                    setPages([...pages, newPage]);
                                  }}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Duplicate Page
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleDeletePage(selectedPage.id)}
                                  disabled={pages.length === 1}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete Page
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="question" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-2 space-y-3">
                        {selectedQuestionId && selectedPage && (
                          <>
                            {(() => {
                              const question = selectedPage.questions.find(q => q.id === selectedQuestionId);
                              if (!question) return null;

                              return (
                                <>
                                  <div className="space-y-2">
                                    <h3 className="text-sm font-medium flex items-center gap-1">
                                      <Type className="h-3 w-3" />
                                      Question Content
                                    </h3>
                                    <div className="grid grid-cols-2 gap-1">
                                      <div className="col-span-2">
                                        <Label className="text-xs">Question Prompt</Label>
                                        <Textarea
                                          value={question.prompt}
                                          onChange={(e) => handleUpdateQuestion(question.id, { prompt: e.target.value })}
                                          rows={2}
                                          className="text-xs"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Question Type</Label>
                                        <Select
                                          value={question.type}
                                          onValueChange={(value) => handleUpdateQuestion(question.id, { type: value as QuestionnaireQuestion['type'] })}
                                        >
                                          <SelectTrigger className="text-xs">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {questionTypes.map((type) => (
                                              <SelectItem key={type.value} value={type.value} className="text-xs">
                                                {type.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>

                                  {question.type === 'slider' && (
                                    <>
                                      <Separator />
                                      <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Slider Settings</h3>
                                        <div className="grid grid-cols-3 gap-1">
                                          <div>
                                            <Label className="text-xs">Min Value</Label>
                                            <Input
                                              type="number"
                                              value={question.min_value || 0}
                                              onChange={(e) => handleUpdateQuestion(question.id, { min_value: parseInt(e.target.value) })}
                                              className="text-xs"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs">Max Value</Label>
                                            <Input
                                              type="number"
                                              value={question.max_value || 100}
                                              onChange={(e) => handleUpdateQuestion(question.id, { max_value: parseInt(e.target.value) })}
                                              className="text-xs"
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs">Unit</Label>
                                            <Input
                                              value={question.unit || '$'}
                                              onChange={(e) => handleUpdateQuestion(question.id, { unit: e.target.value })}
                                              placeholder="$"
                                              className="text-xs"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {(question.type === 'single_select' || question.type === 'multi_select') && (
                                    <>
                                      <Separator />
                                      <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Answer Options</h3>
                                        <div className="space-y-1">
                                          {question.options?.map((option, index) => (
                                            <div key={index} className="flex gap-1">
                                              <Input
                                                value={option}
                                                onChange={(e) => {
                                                  const newOptions = [...(question.options || [])];
                                                  newOptions[index] = e.target.value;
                                                  handleUpdateQuestion(question.id, { options: newOptions });
                                                }}
                                                className="text-xs"
                                              />
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0"
                                                onClick={() => {
                                                  const newOptions = question.options?.filter((_, i) => i !== index);
                                                  handleUpdateQuestion(question.id, { options: newOptions });
                                                }}
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          ))}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => {
                                              const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                                              handleUpdateQuestion(question.id, { options: newOptions });
                                            }}
                                          >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Option
                                          </Button>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div className="flex gap-1">
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      className="text-xs"
                                      onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete Question
                                    </Button>
                                  </div>
                                </>
                              );
                            })()}
                          </>
                        )}
                        {!selectedQuestionId && (
                          <div className="text-center py-4">
                            <p className="text-xs text-muted-foreground">Select a question to edit its properties</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="theme" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-2 space-y-3">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            Global Theme
                          </h3>
                          <div className="grid grid-cols-3 gap-1">
                            <div>
                              <Label className="text-xs">Primary Color</Label>
                              <div className="flex gap-1">
                                <Input
                                  type="color"
                                  value={theme.primaryColor}
                                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                  className="w-8 h-6 p-1"
                                />
                                <Input
                                  value={theme.primaryColor}
                                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                  className="flex-1 text-xs"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Secondary Color</Label>
                              <div className="flex gap-1">
                                <Input
                                  type="color"
                                  value={theme.secondaryColor}
                                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                                  className="w-8 h-6 p-1"
                                />
                                <Input
                                  value={theme.secondaryColor}
                                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                                  className="flex-1 text-xs"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Accent Color</Label>
                              <div className="flex gap-1">
                                <Input
                                  type="color"
                                  value={theme.accentColor}
                                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                                  className="w-8 h-6 p-1"
                                />
                                <Input
                                  value={theme.accentColor}
                                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                                  className="flex-1 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Font Family</Label>
                            <Select
                              value={theme.fontFamily}
                              onValueChange={(value) => setTheme({ ...theme, fontFamily: value })}
                            >
                              <SelectTrigger className="text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter" className="text-xs">Inter</SelectItem>
                                <SelectItem value="Playfair Display" className="text-xs">Playfair Display</SelectItem>
                                <SelectItem value="Arial" className="text-xs">Arial</SelectItem>
                                <SelectItem value="Georgia" className="text-xs">Georgia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>

        {/* Main Questionnaire Preview */}
        <div className="bg-background py-2">
          <div className="container-spacing">
            <div className={`mx-auto transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-xs' :
              previewMode === 'tablet' ? 'max-w-3xl' : 'max-w-5xl'
            }`}>
              {selectedPage && (
                <div className="relative">
                  {/* Title and Navigation - Above Image with minimal padding */}
                  <div className="mb-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-sm font-heading font-medium text-left">{selectedPage.title}</h1>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handlePreviousPage}
                          disabled={currentPageIndex === 0}
                          className="text-xs"
                        >
                          <ChevronLeft className="h-3 w-3 mr-1" />
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleNextPage}
                          disabled={currentPageIndex === pages.length - 1}
                          className="text-xs"
                        >
                          Next
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Background Image Container with Reduced Padding */}
                  <div 
                    className="relative rounded-xl overflow-hidden shadow-floating"
                    style={{
                      aspectRatio: '16/9',
                      backgroundImage: selectedPage.backgroundImage ? `url(${selectedPage.backgroundImage})` : undefined,
                      backgroundColor: selectedPage.backgroundColor || '#5F6E4E',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay for better text readability */}
                    {selectedPage.backgroundImage && (
                      <div className="absolute inset-0 bg-black/30"></div>
                    )}
                    
                    {/* Main Content Wrapper with Reduced Padding */}
                    <div className="absolute inset-0 p-6 flex">
                      {/* Left Panel: Main Question Area - 65% width, centered */}
                      <div className="w-[65%] flex items-center justify-center">
                        <div className="text-center max-w-lg">
                          {/* First Question on Main Image */}
                          {firstQuestion && (
                            <div className="space-y-3">
                              <div>
                                <h3 
                                  className="text-lg md:text-xl font-heading font-medium mb-3 leading-tight"
                                  style={{ color: selectedPage.textColor || '#FFFFFF' }}
                                >
                                  {firstQuestion.prompt}
                                </h3>
                              </div>
                              <div className="max-w-sm mx-auto">
                                {renderQuestionInput(firstQuestion, 'lg')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Panel: Floating Sidebar for Remaining Questions - 35% width */}
                      <div className="w-[35%] flex items-stretch justify-center">
                        <Card className="w-full h-full bg-white/95 backdrop-blur-sm shadow-floating rounded-xl">
                          <CardContent className="p-2 h-full flex flex-col">
                            <div className="space-y-2 flex-1">
                              {/* Remaining Questions */}
                              {remainingQuestions.length > 0 && (
                                <ScrollArea className="flex-1 pr-1">
                                  <div className="space-y-2">
                                    {remainingQuestions.map((question, index) => (
                                      <div 
                                        key={question.id}
                                        className={`transition-all duration-200 ${
                                          selectedQuestionId === question.id ? 'ring-2 ring-primary rounded-lg p-1 -m-1' : ''
                                        }`}
                                      >
                                        <div className="space-y-1">
                                          {/* Question Header with Edit Button */}
                                          <div className="flex items-start justify-between">
                                            <h3 className="text-xs font-medium text-foreground leading-tight pr-1 flex-1">
                                              {question.prompt}
                                            </h3>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-5 w-5 p-0 ml-1 flex-shrink-0"
                                              onClick={() => setSelectedQuestionId(question.id)}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                          </div>

                                          {/* Question Input */}
                                          {renderQuestionInput(question, 'sm')}
                                        </div>

                                        {index < remainingQuestions.length - 1 && (
                                          <Separator className="mt-2" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}

                              {/* Add Question Button */}
                              <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
                                <DialogTrigger asChild>
                                  <div className="border-dashed border-2 border-muted-foreground/30 rounded-lg p-2 text-center hover:border-primary transition-colors cursor-pointer">
                                    <Plus className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                                    <p className="text-xs text-muted-foreground">Add Question</p>
                                  </div>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add New Question</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-1 gap-4">
                                      {questionTypes.map((type) => (
                                        <Card 
                                          key={type.value}
                                          className="cursor-pointer hover:shadow-md transition-all duration-200"
                                          onClick={() => handleAddQuestion(type.value as QuestionnaireQuestion['type'])}
                                        >
                                          <CardContent className="p-3">
                                            <h3 className="font-medium mb-1">{type.label}</h3>
                                            <p className="text-sm text-muted-foreground">{type.description}</p>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* Continue Button */}
                              <div className="flex-shrink-0">
                                <Button className="w-full py-1 text-xs rounded-pill bg-primary hover:bg-primary/90">
                                  Continue
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}