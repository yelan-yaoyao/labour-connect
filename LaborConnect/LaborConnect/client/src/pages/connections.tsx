import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import type { ConnectionWithWorker } from "@shared/schema";

export default function Connections() {
  // This would typically get the current user's ID from auth context
  const currentUserId = 'current-user-id';

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['/api/connections', currentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/connections/${currentUserId}`);
      if (!response.ok) throw new Error('Failed to fetch connections');
      return response.json() as Promise<ConnectionWithWorker[]>;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="connections-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
          My Connections
        </h1>
        <p className="text-muted-foreground" data-testid="page-description">
          Workers you've connected with and hired
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8" data-testid="loading-state">
          <p className="text-muted-foreground">Loading connections...</p>
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-8" data-testid="empty-state">
          <p className="text-muted-foreground">
            You haven't connected with any workers yet.{' '}
            <Link href="/find-people" className="text-primary hover:underline">
              Find workers to connect with
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="connections-grid">
          {connections.map((connection) => (
            <Card key={connection.id} data-testid={`connection-card-${connection.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground" data-testid={`connection-name-${connection.id}`}>
                      {connection.worker.firstName} {connection.worker.lastName}
                    </h3>
                    <p className="text-sm text-primary" data-testid={`connection-skill-${connection.id}`}>
                      {connection.worker.workerProfile.skills}
                    </p>
                  </div>
                </div>
                {connection.lastProject && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Last Project:</p>
                    <p className="text-sm text-foreground" data-testid={`connection-project-${connection.id}`}>
                      {connection.lastProject}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href="/chat" className="flex-1">
                    <Button variant="default" className="w-full" data-testid={`button-message-${connection.id}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </Link>
                  <Button variant="secondary" className="flex-1" data-testid={`button-hire-again-${connection.id}`}>
                    Hire Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
