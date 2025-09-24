import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type UserType = 'worker' | 'employer';

export default function Register() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<UserType>('worker');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    // Worker fields
    skills: "",
    experience: "",
    location: "",
    // Employer fields
    companyName: "",
    industry: "",
    jobNeeds: "",
    employerLocation: "",
    // Terms
    acceptTerms: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/auth/register', data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Welcome to Labor Connect! You can now sign in.",
      });
      setLocation('/login');
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    // Prepare data based on user type
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: userType,
    };

    if (userType === 'worker') {
      if (!formData.skills || !formData.experience || !formData.location) {
        toast({
          title: "Error",
          description: "Please fill in all worker profile fields.",
          variant: "destructive",
        });
        return;
      }
      Object.assign(submitData, {
        skills: formData.skills,
        experience: formData.experience,
        location: formData.location,
      });
    } else {
      if (!formData.companyName || !formData.industry) {
        toast({
          title: "Error",
          description: "Please fill in all employer profile fields.",
          variant: "destructive",
        });
        return;
      }
      Object.assign(submitData, {
        companyName: formData.companyName,
        industry: formData.industry,
        jobNeeds: formData.jobNeeds,
        location: formData.employerLocation,
      });
    }

    registerMutation.mutate(submitData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-8" data-testid="register-page">
      <div className="max-w-2xl w-full mx-4">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-bg bg-clip-text text-transparent mb-2">
                Labor Connect
              </h1>
              <h2 className="text-2xl font-semibold text-card-foreground" data-testid="register-title">
                Create Account
              </h2>
              <p className="text-muted-foreground mt-2" data-testid="register-description">
                Join our community of workers and employers
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-form">
              {/* User Type Selection */}
              <div>
                <Label className="block text-sm font-medium text-foreground mb-3">
                  I want to register as:
                </Label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={(value) => setUserType(value as UserType)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  data-testid="user-type-selection"
                >
                  <div className={`border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${userType === 'worker' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="worker" id="worker" data-testid="radio-worker" />
                      <div>
                        <Label htmlFor="worker" className="font-medium text-card-foreground cursor-pointer">
                          Worker
                        </Label>
                        <p className="text-sm text-muted-foreground">Find job opportunities</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${userType === 'employer' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="employer" id="employer" data-testid="radio-employer" />
                      <div>
                        <Label htmlFor="employer" className="font-medium text-card-foreground cursor-pointer">
                          Employer
                        </Label>
                        <p className="text-sm text-muted-foreground">Hire skilled workers</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name *
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password *
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  required
                  data-testid="input-password"
                />
              </div>

              {/* Worker-Specific Fields */}
              {userType === 'worker' && (
                <div className="space-y-4" data-testid="worker-fields">
                  <div>
                    <Label htmlFor="skills" className="block text-sm font-medium text-foreground mb-2">
                      Skills/Job Type *
                    </Label>
                    <Select value={formData.skills} onValueChange={(value) => handleInputChange('skills', value)}>
                      <SelectTrigger id="skills" data-testid="select-skills">
                        <SelectValue placeholder="Select your primary skill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Carpenter">Carpenter</SelectItem>
                        <SelectItem value="Electrician">Electrician</SelectItem>
                        <SelectItem value="Plumber">Plumber</SelectItem>
                        <SelectItem value="Cleaner">Cleaner</SelectItem>
                        <SelectItem value="Farm Worker">Farm Worker</SelectItem>
                        <SelectItem value="General Laborer">General Laborer</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
                      Years of Experience *
                    </Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger id="experience" data-testid="select-experience">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                        <SelectItem value="1-3 years">1-3 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-10 years">5-10 years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                      Location *
                    </Label>
                    <Input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State"
                      required
                      data-testid="input-worker-location"
                    />
                  </div>
                </div>
              )}

              {/* Employer-Specific Fields */}
              {userType === 'employer' && (
                <div className="space-y-4" data-testid="employer-fields">
                  <div>
                    <Label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                      Company Name *
                    </Label>
                    <Input
                      type="text"
                      id="company"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="ABC Construction LLC"
                      required
                      data-testid="input-company-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry" className="block text-sm font-medium text-foreground mb-2">
                      Industry *
                    </Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger id="industry" data-testid="select-industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Cleaning Services">Cleaning Services</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employerLocation" className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </Label>
                    <Input
                      type="text"
                      id="employerLocation"
                      value={formData.employerLocation}
                      onChange={(e) => handleInputChange('employerLocation', e.target.value)}
                      placeholder="City, State"
                      data-testid="input-employer-location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="job-needs" className="block text-sm font-medium text-foreground mb-2">
                      Primary Job Needs
                    </Label>
                    <Textarea
                      id="job-needs"
                      rows={3}
                      value={formData.jobNeeds}
                      onChange={(e) => handleInputChange('jobNeeds', e.target.value)}
                      placeholder="Describe the types of workers you typically need..."
                      data-testid="textarea-job-needs"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                  required
                  data-testid="checkbox-terms"
                />
                <Label htmlFor="terms" className="text-sm text-foreground">
                  I agree to the{' '}
                  <Link href="#" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
                data-testid="button-create-account"
              >
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  data-testid="link-login"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
