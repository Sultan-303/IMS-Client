interface CypressConfig {
  baseUrl: string;
  viewportWidth: number;
  viewportHeight: number;
  [key: string]: any;
}

interface PluginEvents {
  // Define specific event types if needed
}

export default (on: PluginEvents, config: CypressConfig): CypressConfig => {
  config.baseUrl = 'http://localhost:3000';
  config.viewportWidth = 1280;
  config.viewportHeight = 720;
  return config;
};