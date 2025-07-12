using Microsoft.Extensions.DependencyInjection;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Plugins;
using JellyfinUpscalerPlugin.Services;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Plugin service registrator for dependency injection
    /// </summary>
    public class PluginServiceRegistrator : IPluginServiceRegistrator
    {
        /// <summary>
        /// Register plugin services
        /// </summary>
        /// <param name="serviceCollection">Service collection</param>
        /// <param name="serverApplicationHost">Server application host</param>
        public void RegisterServices(IServiceCollection serviceCollection, IServerApplicationHost serverApplicationHost)
        {
            // Register the AI Upscaler background service
            serviceCollection.AddHostedService<UpscalerService>();
            
            // Register the Hardware Benchmark service (v1.4.0 NEW)
            serviceCollection.AddSingleton<HardwareBenchmarkService>();
            serviceCollection.AddHostedService<HardwareBenchmarkService>(provider => provider.GetService<HardwareBenchmarkService>());
        }
    }
}