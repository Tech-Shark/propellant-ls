import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { Mail, Send, Users, User as UserIcon, CheckCircle, AlertCircle } from "lucide-react";
import axiosInstance from "@/api/AxiosInstance";
import { toast } from "sonner";

interface EmailData {
  subject: string;
  content: string;
  recipients: 'all' | 'individual';
  selectedUserId?: string;
}

export function EmailManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    subject: '',
    content: '',
    recipients: 'all'
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSendEmail = async () => {
    if (!emailData.subject.trim() || !emailData.content.trim()) {
      toast.error('Please fill in both subject and content');
      return;
    }

    if (emailData.recipients === 'individual' && !emailData.selectedUserId) {
      toast.error('Please select a user to send the email to');
      return;
    }

    setIsSending(true);
    try {
      const endpoint = emailData.recipients === 'all' 
        ? '/admin/send-email/all' 
        : `/admin/send-email/user/${emailData.selectedUserId}`;

      await axiosInstance.post(endpoint, {
        subject: emailData.subject,
        content: emailData.content
      });

      toast.success(`Email sent successfully to ${emailData.recipients === 'all' ? 'all users' : 'selected user'}`);
      setIsModalOpen(false);
      setEmailData({
        subject: '',
        content: '',
        recipients: 'all'
      });
    } catch (error) {
      toast.error('Failed to send email');
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setEmailData({
      subject: '',
      content: '',
      recipients: 'all'
    });
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.deactivated).length;
  const talentUsers = users.filter(user => user.role === 'TALENT').length;
  const organizationUsers = users.filter(user => user.role === 'ORGANIZATION').length;

  return (
    <div className="space-y-6">
      {/* Email Management Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Non-deactivated users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talent</CardTitle>
            <UserIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{talentUsers}</div>
            <p className="text-xs text-muted-foreground">Talent accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <UserIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{organizationUsers}</div>
            <p className="text-xs text-muted-foreground">Organization accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Composition */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Management
          </CardTitle>
          <CardDescription>
            Send emails to individual users or broadcast to all platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={isModalOpen} onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-none">
                  <Mail className="h-4 w-4 mr-2" />
                  Compose Email
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Compose Email</DialogTitle>
                  <DialogDescription>
                    Send an email to users on the platform
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Recipient Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <Select
                      value={emailData.recipients}
                      onValueChange={(value: 'all' | 'individual') => 
                        setEmailData({ ...emailData, recipients: value, selectedUserId: undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            All Users ({totalUsers})
                          </div>
                        </SelectItem>
                        <SelectItem value="individual">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Individual User
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Individual User Selection */}
                  {emailData.recipients === 'individual' && (
                    <div className="space-y-2">
                      <Label htmlFor="user">Select User</Label>
                      <Select
                        value={emailData.selectedUserId}
                        onValueChange={(value) => 
                          setEmailData({ ...emailData, selectedUserId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                  <span className="font-medium">{user.fullname || user.email}</span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                                <Badge variant={user.role === 'TALENT' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter email subject"
                      value={emailData.subject}
                      onChange={(e) => 
                        setEmailData({ ...emailData, subject: e.target.value })
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter email content..."
                      className="min-h-[200px]"
                      value={emailData.content}
                      onChange={(e) => 
                        setEmailData({ ...emailData, content: e.target.value })
                      }
                    />
                  </div>

                  {/* Preview */}
                  {emailData.subject && emailData.content && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-medium mb-2">Preview:</h4>
                      <div className="text-sm space-y-2">
                        <div><strong>To:</strong> {emailData.recipients === 'all' ? `All Users (${totalUsers})` : 'Selected User'}</div>
                        <div><strong>Subject:</strong> {emailData.subject}</div>
                        <div><strong>Content:</strong></div>
                        <div className="whitespace-pre-wrap bg-background p-3 rounded border">
                          {emailData.content}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSending || !emailData.subject.trim() || !emailData.content.trim()}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Email'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh Users'}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setEmailData({
                      subject: 'Welcome to Propellant HR',
                      content: 'Dear User,\n\nWelcome to Propellant HR! We\'re excited to have you on board.\n\nBest regards,\nThe Propellant HR Team',
                      recipients: 'all'
                    });
                    setIsModalOpen(true);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Welcome Email Template
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setEmailData({
                      subject: 'Platform Update Notification',
                      content: 'Dear User,\n\nWe have exciting new updates to share with you.\n\nBest regards,\nThe Propellant HR Team',
                      recipients: 'all'
                    });
                    setIsModalOpen(true);
                  }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Update Notification Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Recipients:</span>
                  <span className="font-medium">{activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Talent Users:</span>
                  <span className="font-medium">{talentUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Organizations:</span>
                  <span className="font-medium">{organizationUsers}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}