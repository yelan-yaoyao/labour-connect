import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { WorkerWithProfile } from "@shared/schema";

export default function FindPeople() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const { data: workers = [], isLoading } = useQuery({
    queryKey: ['/api/workers', searchTerm, locationFilter, availabilityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('skills', searchTerm);
      if (locationFilter && locationFilter !== 'all-locations') params.append('location', locationFilter);
      if (availabilityFilter && availabilityFilter !== 'all-availability') params.append('availability', availabilityFilter);
      
      const response = await fetch(`/api/workers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch workers');
      return response.json() as Promise<WorkerWithProfile[]>;
    }
  });

  const handleContact = async (workerId: string, workerName: string) => {
    try {
      // This would typically create a connection
      await apiRequest('POST', '/api/connections', {
        employerId: 'current-user-id', // This should come from auth context
        workerId,
        status: 'connected'
      });
      
      toast({
        title: "Contact Initiated",
        description: `You've successfully contacted ${workerName}. They will be notified.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to contact worker. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleHire = async (workerId: string, workerName: string) => {
    try {
      await apiRequest('POST', '/api/connections', {
        employerId: 'current-user-id', // This should come from auth context
        workerId,
        status: 'hired'
      });
      
      toast({
        title: "Hire Request Sent",
        description: `You've sent a hire request to ${workerName}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send hire request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="find-people-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
          Find Workers
        </h1>
        <p className="text-muted-foreground" data-testid="page-description">
          Browse and connect with skilled professionals in your area
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8" data-testid="search-filters">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                Search by Skill
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="e.g., Carpenter, Cleaner, Farm Worker"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                Location
              </Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location" data-testid="select-location">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">All Locations</SelectItem>
                  <SelectItem value="New York, NY">New York, NY</SelectItem>
                  <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                  <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                  <SelectItem value="Houston, TX">Houston, TX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="availability" className="block text-sm font-medium text-foreground mb-2">
                Availability
              </Label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger id="availability" data-testid="select-availability">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-availability">All</SelectItem>
                  <SelectItem value="Available Now">Available Now</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-search"
          >
            Search Workers
          </Button>
        </CardContent>
      </Card>

      {/* Worker Profiles Grid */}
      {isLoading ? (
        <div className="text-center py-8" data-testid="loading-state">
          <p className="text-muted-foreground">Loading workers...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-8" data-testid="empty-state">
          <p className="text-muted-foreground">No workers found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="workers-grid">
          {workers.map((worker) => (
            <Card key={worker.id} className="card-hover" data-testid={`worker-card-${worker.id}`}>
              <CardContent className="p-6">
                {/* Worker profile placeholder */}
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-card-foreground mb-1" data-testid={`worker-name-${worker.id}`}>
                    {worker.firstName} {worker.lastName}
                  </h3>
                  <p className="text-primary font-medium mb-2" data-testid={`worker-skill-${worker.id}`}>
                    {worker.workerProfile.skills}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1" data-testid={`worker-location-${worker.id}`}>
                    📍 {worker.workerProfile.location}
                  </p>
                  <p className={`text-sm mb-4 ${
                    worker.workerProfile.availability === 'Available Now' 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`} data-testid={`worker-availability-${worker.id}`}>
                    {worker.workerProfile.availability === 'Available Now' ? '✅' : '⏰'} {worker.workerProfile.availability}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleHire(worker.id, `${worker.firstName} ${worker.lastName}`)}
                      data-testid={`button-hire-${worker.id}`}
                    >
                      Hire Now
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleContact(worker.id, `${worker.firstName} ${worker.lastName}`)}
                      data-testid={`button-contact-${worker.id}`}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
