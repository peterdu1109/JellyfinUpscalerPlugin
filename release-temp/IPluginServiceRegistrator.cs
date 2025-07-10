using Microsoft.Extensions.DependencyInjection;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Interface for plugins that need to register services with dependency injection
    /// Provides Jellyfin-compatible service registration
    /// </summary>
    public interface IPluginServiceRegistrator
    {
        /// <summary>
        /// Register plugin services with the dependency injection container
        /// </summary>
        /// <param name="serviceCollection">Service collection to register with</param>
        void RegisterServices(IServiceCollection serviceCollection);
    }
}