/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['sambaads-player'],
  /**
   * Your New Relic license key.
   */
  license_key: '66fce5f813e163030156c2cd7e079c0e58320dfb',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info',
    agent_enabled: process.env.NODE_ENV==='production',
    filepath : '/app/sambaads_player/current/newrelic_agent.log'
  }
}
