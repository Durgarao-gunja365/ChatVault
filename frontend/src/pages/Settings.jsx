import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  Eye,
  MessageCircle,
  Zap,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function PreferencesPage() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const [preferences, setPreferences] = useState({
    // Appearance
    theme: user?.preferences?.theme || "system",
    fontSize: user?.preferences?.fontSize || "medium",
    compactMode: user?.preferences?.compactMode || false,
    
    // Notifications
    emailNotifications: user?.preferences?.emailNotifications || true,
    pushNotifications: user?.preferences?.pushNotifications || true,
    soundEnabled: user?.preferences?.soundEnabled || true,
    messageSounds: user?.preferences?.messageSounds || true,
    
    // Privacy
    showOnlineStatus: user?.preferences?.showOnlineStatus || true,
    allowDataCollection: user?.preferences?.allowDataCollection || false,
    autoDeleteMessages: user?.preferences?.autoDeleteMessages || "never",
    
    // Chat
    aiResponseSpeed: user?.preferences?.aiResponseSpeed || "balanced",
    messageHistory: user?.preferences?.messageHistory || "30days",
    typingIndicators: user?.preferences?.typingIndicators || true,
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser({ preferences });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setPreferences({
      theme: "system",
      fontSize: "medium",
      compactMode: false,
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      messageSounds: true,
      showOnlineStatus: true,
      allowDataCollection: false,
      autoDeleteMessages: "never",
      aiResponseSpeed: "balanced",
      messageHistory: "30days",
      typingIndicators: true,
    });
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Settings },
  ];

  const speedOptions = [
    { value: "fast", label: "Fast", description: "Quick responses, lower quality" },
    { value: "balanced", label: "Balanced", description: "Good speed and quality" },
    { value: "quality", label: "High Quality", description: "Best responses, slower" },
  ];

  const historyOptions = [
    { value: "7days", label: "7 days" },
    { value: "30days", label: "30 days" },
    { value: "90days", label: "90 days" },
    { value: "forever", label: "Forever" },
  ];

  const deleteOptions = [
    { value: "never", label: "Never delete" },
    { value: "30days", label: "After 30 days" },
    { value: "90days", label: "After 90 days" },
    { value: "1year", label: "After 1 year" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Application Preferences
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Preferences
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Customize your AI Chat Portal experience to suit your needs
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Save Bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {saveStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Preferences saved successfully!</span>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Error saving preferences</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSavePreferences} className="space-y-8">
              {/* Appearance Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                    <Sun className="w-5 h-5 text-blue-600" />
                  </div>
                  Appearance
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handlePreferenceChange('theme', option.value)}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              preferences.theme === option.value
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                              preferences.theme === option.value ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <div className={`text-sm font-medium ${
                              preferences.theme === option.value ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {option.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Font Size</label>
                    <select
                      value={preferences.fontSize}
                      onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>

                  {/* Additional Appearance Options */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.compactMode}
                        onChange={(e) => handlePreferenceChange('compactMode', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                      <span className="text-xs text-gray-500">Reduce spacing for more content</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Notifications Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  Notifications
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Get browser notifications' },
                    { key: 'soundEnabled', label: 'Sound Effects', description: 'Play sounds for new messages', icon: preferences.soundEnabled ? Volume2 : VolumeX },
                    { key: 'messageSounds', label: 'Message Sounds', description: 'Play sound when AI responds' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[item.key]}
                        onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{item.label}</span>
                          {item.icon && <item.icon className="w-4 h-4 text-gray-400" />}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Privacy Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  Privacy & Data
                </h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Message History</label>
                      <select
                        value={preferences.messageHistory}
                        onChange={(e) => handlePreferenceChange('messageHistory', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {historyOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Auto-delete Messages</label>
                      <select
                        value={preferences.autoDeleteMessages}
                        onChange={(e) => handlePreferenceChange('autoDeleteMessages', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {deleteOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you are active' },
                      { key: 'allowDataCollection', label: 'Help Improve AI', description: 'Allow anonymous usage data to improve the service' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[item.key]}
                          onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{item.label}</span>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* Chat Settings Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  Chat Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* AI Response Speed */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">AI Response Speed</label>
                    <div className="space-y-3">
                      {speedOptions.map((option) => (
                        <label key={option.value} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="aiResponseSpeed"
                            value={option.value}
                            checked={preferences.aiResponseSpeed === option.value}
                            onChange={(e) => handlePreferenceChange('aiResponseSpeed', e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{option.label}</span>
                              <Zap className="w-4 h-4 text-yellow-500" />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Chat Options */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Chat Features</label>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={preferences.typingIndicators}
                          onChange={(e) => handlePreferenceChange('typingIndicators', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-gray-800">Typing Indicators</span>
                          <p className="text-sm text-gray-600 mt-1">Show when AI is typing</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={true}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          disabled
                        />
                        <div>
                          <span className="font-medium text-gray-800">Smart Suggestions</span>
                          <p className="text-sm text-gray-600 mt-1">Show relevant quick prompts</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}