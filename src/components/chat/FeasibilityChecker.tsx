import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  MapPin, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plane,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CheckResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
}

export default function FeasibilityChecker() {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [canCheckFlights, setCanCheckFlights] = useState(false);
  const [checks, setChecks] = useState<CheckResult[]>([]);

  const runFeasibilityCheck = async () => {
    if (!destination || !travelDate) return;
    
    setIsChecking(true);
    setCanCheckFlights(false);
    
    const checkSequence: CheckResult[] = [
      { id: '1', name: 'Weather Check', status: 'pending' },
      { id: '2', name: 'Visa Requirements', status: 'pending' },
      { id: '3', name: 'Safety Assessment', status: 'pending' },
      { id: '4', name: 'Local Events', status: 'pending' },
      { id: '5', name: 'Accommodation Availability', status: 'pending' }
    ];
    
    setChecks(checkSequence);
    
    // Simulate running checks with delays
    for (let i = 0; i < checkSequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedChecks = [...checkSequence];
      updatedChecks[i].status = 'running';
      setChecks([...updatedChecks]);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulate some checks failing
      if (i === 2 && destination.toLowerCase().includes('protest')) {
        updatedChecks[i].status = 'failed';
        updatedChecks[i].message = 'Protests ongoing in central districts';
      } else {
        updatedChecks[i].status = 'passed';
      }
      
      setChecks([...updatedChecks]);
    }
    
    setIsChecking(false);
    
    // Enable flight check if all passed
    const allPassed = checkSequence.every(check => 
      check.status === 'passed' || check.status === 'failed'
    );
    const anyFailed = checkSequence.some(check => check.status === 'failed');
    
    if (allPassed && !anyFailed) {
      setCanCheckFlights(true);
    }
  };

  const runFlightCheck = () => {
    // Placeholder for flight price check
    console.log('Running flight price check...');
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'running':
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: CheckResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-muted';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Feasibility & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Tokyo, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Travel Window</Label>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !travelDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {travelDate ? format(travelDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={travelDate}
                    onSelect={(date) => {
                      setTravelDate(date);
                      setIsOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              onClick={runFeasibilityCheck}
              disabled={!destination || !travelDate || isChecking}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              {isChecking ? 'Running Checks...' : 'Run Feasibility Check'}
            </Button>
          </div>

          {/* Results Section */}
          {checks.length > 0 && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Real-Time Feedback</h4>
                <div className="space-y-2">
                  {checks.map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <span className="text-sm font-medium">{check.name}</span>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failed Check Messages */}
              {checks.some(check => check.status === 'failed') && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-red-800 mb-1">Issues Found</h5>
                      {checks
                        .filter(check => check.status === 'failed')
                        .map(check => (
                          <p key={check.id} className="text-sm text-red-700">
                            {check.message}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Flight Check Button */}
              {canCheckFlights && (
                <Button 
                  onClick={runFlightCheck}
                  variant="secondary"
                  className="w-full"
                >
                  <Plane className="mr-2 h-4 w-4" />
                  Run Flight Price Check
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}