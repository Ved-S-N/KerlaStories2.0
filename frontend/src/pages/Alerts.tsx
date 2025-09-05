import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CloudRain, Wind, Thermometer, Droplets, Bell, MapPin, Calendar } from 'lucide-react';

const currentAlerts = [
  {
    type: 'Heavy Rainfall',
    severity: 'High',
    location: 'Northern Kerala',
    districts: ['Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'],
    startDate: '2024-03-16',
    endDate: '2024-03-18',
    description: 'Heavy to very heavy rainfall expected. Risk of waterlogging in low-lying areas.',
    recommendation: 'Avoid outdoor farm activities. Ensure proper drainage in fields.',
    icon: CloudRain,
    color: 'destructive'
  },
  {
    type: 'Strong Winds',
    severity: 'Medium',
    location: 'Coastal Kerala',
    districts: ['Ernakulam', 'Thrissur', 'Malappuram', 'Kozhikode'],
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    description: 'Wind speeds up to 40-50 kmph expected along coastal areas.',
    recommendation: 'Secure greenhouse structures and temporary sheds.',
    icon: Wind,
    color: 'default'
  },
  {
    type: 'Temperature Rise',
    severity: 'Low',
    location: 'Central Kerala',
    districts: ['Palakkad', 'Thrissur', 'Ernakulam'],
    startDate: '2024-03-17',
    endDate: '2024-03-20',
    description: 'Day temperatures may rise to 35-37°C in inland areas.',
    recommendation: 'Increase irrigation frequency. Provide shade for livestock.',
    icon: Thermometer,
    color: 'secondary'
  }
];

const weatherData = [
  {
    district: 'Thiruvananthapuram',
    temperature: '31°C / 24°C',
    humidity: '78%',
    rainfall: '15mm',
    windSpeed: '12 kmph',
    condition: 'Partly Cloudy'
  },
  {
    district: 'Kochi',
    temperature: '32°C / 25°C',
    humidity: '82%',
    rainfall: '8mm',
    windSpeed: '18 kmph',
    condition: 'Light Rain'
  },
  {
    district: 'Kozhikode',
    temperature: '30°C / 23°C',
    humidity: '85%',
    rainfall: '25mm',
    windSpeed: '22 kmph',
    condition: 'Heavy Rain'
  },
  {
    district: 'Thrissur',
    temperature: '33°C / 26°C',
    humidity: '75%',
    rainfall: '5mm',
    windSpeed: '14 kmph',
    condition: 'Clear Sky'
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'High': return 'bg-destructive text-destructive-foreground';
    case 'Medium': return 'bg-accent text-accent-foreground';
    case 'Low': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function Alerts() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Weather Alerts & Notifications
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time weather alerts, rainfall warnings, and agricultural advisories 
            to help you protect your crops and livestock.
          </p>
        </div>

        {/* Emergency Alert Banner */}
        <Alert className="mb-8 border-destructive bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            <strong>Active Alert:</strong> Heavy rainfall warning issued for Northern Kerala. 
            Farmers advised to postpone field activities and ensure proper drainage.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Alerts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <AlertTriangle className="h-6 w-6 text-accent mr-2" />
                Active Weather Alerts
              </h2>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Subscribe to Alerts
              </Button>
            </div>

            {currentAlerts.map((alert, index) => {
              const IconComponent = alert.icon;
              return (
                <Card key={index} className="bg-gradient-card hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{alert.type}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {alert.location}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity} Alert
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{alert.description}</p>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-accent" />
                        Recommendation
                      </h4>
                      <p className="text-sm">{alert.recommendation}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(alert.startDate).toLocaleDateString()} - {new Date(alert.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">Affected Districts:</p>
                      <div className="flex flex-wrap gap-1">
                        {alert.districts.map((district, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {district}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Weather Dashboard */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CloudRain className="h-5 w-5 mr-2 text-primary" />
                  District Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weatherData.map((data, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{data.district}</h4>
                      <Badge variant="outline" className="text-xs">
                        {data.condition}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <Thermometer className="h-3 w-3 mr-1 text-muted-foreground" />
                        {data.temperature}
                      </div>
                      <div className="flex items-center">
                        <Droplets className="h-3 w-3 mr-1 text-muted-foreground" />
                        {data.humidity}
                      </div>
                      <div className="flex items-center">
                        <CloudRain className="h-3 w-3 mr-1 text-muted-foreground" />
                        {data.rainfall}
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-3 w-3 mr-1 text-muted-foreground" />
                        {data.windSpeed}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alert Preferences */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Alert Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    <span className="text-sm">Rainfall Warnings</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    <span className="text-sm">Wind Speed Alerts</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">Temperature Changes</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    <span className="text-sm">Drought Warnings</span>
                  </label>
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  Update Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-medium">Disaster Management</div>
                    <div className="opacity-90">1077 (Toll Free)</div>
                  </div>
                  <div>
                    <div className="font-medium">Agricultural Officer</div>
                    <div className="opacity-90">0471-2301234</div>
                  </div>
                  <div>
                    <div className="font-medium">Weather Helpline</div>
                    <div className="opacity-90">1800-180-1551</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}