import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon,
  Plus,
  X,
  Users,
  Clock,
  MapPin,
  Plane,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  FileText,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Validation schema
const planTripSchema = z.object({
  tripName: z.string()
    .min(1, 'Trip name is required')
    .max(50, 'Trip name must be 50 characters or less'),
  durationType: z.enum(['days', 'dateRange'], {
    required_error: 'Please select a duration type'
  }),
  numberOfDays: z.number()
    .min(1, 'Trip must be at least 1 day')
    .max(365, 'Trip cannot exceed 365 days')
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  collaborators: z.array(z.object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().optional()
  })).optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional()
}).refine((data) => {
  if (data.durationType === 'days') {
    return data.numberOfDays !== undefined && data.numberOfDays > 0;
  }
  if (data.durationType === 'dateRange') {
    return data.startDate && data.endDate && data.endDate > data.startDate;
  }
  return false;
}, {
  message: 'Please provide valid trip duration',
  path: ['durationType']
});

type PlanTripFormData = z.infer<typeof planTripSchema>;

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistData: {
    name: string;
    country: string;
    city?: string;
    inspirationCount: number;
    image?: string;
  };
  onSubmit: (data: PlanTripFormData) => Promise<void>;
}

export default function PlanTripModal({ isOpen, onClose, wishlistData, onSubmit }: PlanTripModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<PlanTripFormData>({
    resolver: zodResolver(planTripSchema),
    defaultValues: {
      tripName: '',
      durationType: 'dateRange',
      numberOfDays: 7,
      startDate: undefined,
      endDate: undefined,
      collaborators: [],
      notes: ''
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collaborators'
  });

  const durationType = watch('durationType');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const numberOfDays = watch('numberOfDays');
  const tripName = watch('tripName');

  // Auto-generate trip name suggestion
  useEffect(() => {
    if (!tripName && wishlistData) {
      const suggestion = wishlistData.city 
        ? `${wishlistData.city} Adventure`
        : `${wishlistData.country} Journey`;
      setValue('tripName', suggestion);
    }
  }, [wishlistData, tripName, setValue]);

  // Auto-calculate end date when start date and days change
  useEffect(() => {
    if (durationType === 'days' && startDate && numberOfDays) {
      const calculatedEndDate = addDays(startDate, numberOfDays - 1);
      setValue('endDate', calculatedEndDate);
    }
  }, [durationType, startDate, numberOfDays, setValue]);

  const addCollaborator = () => {
    append({ email: '', name: '' });
  };

  const removeCollaborator = (index: number) => {
    remove(index);
  };

  const handleFormSubmit = async (data: PlanTripFormData) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(data);
      setShowSuccess(true);
      
      // Show success state for 2 seconds, then close
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        reset();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting trip request:', error);
      toast({
        title: "Request Failed",
        description: "Failed to submit trip planning request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setShowSuccess(false);
    }
  };

  // Calculate trip duration for display
  const getTripDuration = () => {
    if (durationType === 'days' && numberOfDays) {
      return `${numberOfDays} days`;
    }
    if (durationType === 'dateRange' && startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `${days} days`;
    }
    return null;
  };

  // Success state
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your travel advisor will review your request and get back to you within 24 hours.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Closing automatically...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            Plan Your Trip
          </DialogTitle>
        </DialogHeader>

        {/* Wishlist Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {wishlistData.image && (
                <img 
                  src={wishlistData.image} 
                  alt={wishlistData.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg">{wishlistData.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{wishlistData.country}</span>
                  <Badge variant="secondary" className="ml-2">
                    {wishlistData.inspirationCount} inspirations
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Converting to</div>
                <div className="font-medium text-primary">Trip Request</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* 1. Trip Name */}
          <div className="space-y-2">
            <Label htmlFor="tripName" className="flex items-center gap-2 text-base font-medium">
              <FileText className="h-4 w-4" />
              Trip Name *
            </Label>
            <Input
              id="tripName"
              placeholder="Enter your trip name"
              {...register('tripName')}
              className={cn(errors.tripName && 'border-red-500')}
              maxLength={50}
            />
            <div className="flex justify-between items-center">
              {errors.tripName && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.tripName.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {tripName?.length || 0}/50 characters
              </p>
            </div>
          </div>

          {/* 2. Trip Duration */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Clock className="h-4 w-4" />
              Trip Duration *
            </Label>
            
            <RadioGroup 
              value={durationType} 
              onValueChange={(value) => setValue('durationType', value as 'days' | 'dateRange')}
              className="space-y-4"
            >
              {/* Option A: Number of Days */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="days" id="days" />
                  <Label htmlFor="days" className="font-medium">Number of days</Label>
                </div>
                {durationType === 'days' && (
                  <div className="ml-6 space-y-2">
                    <Input
                      type="number"
                      placeholder="Enter number of days"
                      {...register('numberOfDays', { valueAsNumber: true })}
                      className={cn(errors.numberOfDays && 'border-red-500')}
                      min={1}
                      max={365}
                    />
                    {errors.numberOfDays && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.numberOfDays.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Option B: Date Range */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dateRange" id="dateRange" />
                  <Label htmlFor="dateRange" className="font-medium">Specific dates</Label>
                </div>
                {durationType === 'dateRange' && (
                  <div className="ml-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div className="space-y-2">
                        <Label className="text-sm">Start Date</Label>
                        <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground",
                                errors.startDate && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "MMM d, yyyy") : "Pick start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setValue('startDate', date);
                                setIsStartDateOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* End Date */}
                      <div className="space-y-2">
                        <Label className="text-sm">End Date</Label>
                        <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground",
                                errors.endDate && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "MMM d, yyyy") : "Pick end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                setValue('endDate', date);
                                setIsEndDateOpen(false);
                              }}
                              disabled={(date) => date < (startDate || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    {/* Duration Display */}
                    {getTripDuration() && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Trip duration: {getTripDuration()}</span>
                      </div>
                    )}
                    
                    {errors.durationType && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.durationType.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          {/* 3. Collaborators */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Users className="h-4 w-4" />
                Collaborators
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCollaborator}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Collaborator
              </Button>
            </div>
            
            {fields.length > 0 && (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Enter email address"
                        {...register(`collaborators.${index}.email`)}
                        className={cn(errors.collaborators?.[index]?.email && 'border-red-500')}
                      />
                      {errors.collaborators?.[index]?.email && (
                        <p className="text-xs text-red-600">
                          {errors.collaborators[index]?.email?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollaborator(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {fields.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No collaborators added yet
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCollaborator}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Collaborator
                </Button>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-base font-medium">
              <FileText className="h-4 w-4" />
              Additional Notes
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requests, preferences, or additional information for your travel advisor..."
              {...register('notes')}
              className={cn(errors.notes && 'border-red-500')}
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              {errors.notes && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.notes.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {watch('notes')?.length || 0}/500 characters
              </p>
            </div>
          </div>

          <Separator />

          {/* Trip Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Trip Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-medium">{wishlistData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inspirations:</span>
                  <span className="font-medium">{wishlistData.inspirationCount} saved items</span>
                </div>
                {getTripDuration() && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{getTripDuration()}</span>
                  </div>
                )}
                {fields.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collaborators:</span>
                    <span className="font-medium">{fields.length} people</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-800">
                <ArrowRight className="h-4 w-4" />
                What happens next?
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Your travel advisor will review your wishlist and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>They'll create a personalized itinerary based on your saved inspirations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>You'll receive a detailed proposal within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Collaborate in real-time to refine your perfect trip</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Initiate Request for Travel Advisor
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}