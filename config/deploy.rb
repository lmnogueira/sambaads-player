# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'sambaads_player'
set :repo_url, 'git@player.github.com:sambaads/sambaads-player.git'

set :branch, 'master'

set :deploy_to, '/app/sambaads_player'

set :scm, :git

# Default value for :pty is false
set :pty, true

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('node_modules', 'app/node_modules')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 1

namespace :npm do
  desc <<-DESC
        Install the project dependencies via npm. By default, devDependencies \
        will not be installed. The install command is executed \
        with the --production, --silent and --no-spin flags.
        You can override any of these defaults by setting the variables shown below.
          set :npm_target_path, nil
          set :npm_flags, '--production --silent --no-spin'
          set :npm_roles, :all
          set :npm_env_variables, {}
    DESC
  task :install do
    on roles fetch(:npm_roles) do
      within_targets do
        with fetch(:npm_env_variables, {}) do
          execute :npm, 'install', fetch(:npm_flags)
        end
      end
    end
  end

  desc "install gulp"
  namespace :install do
    task :gulp do
      on roles fetch(:npm_roles) do
        within_targets do
          with fetch(:npm_env_variables, {}) do
            execute :npm, 'install', 'gulp'
          end
        end
      end
    end
  end

  def within_targets
    npm_targets = []
    npm_targets |= [fetch(:npm_target_path, release_path)]
    npm_targets = npm_targets.flatten.uniq
    npm_targets.each do |target|
      within target do
        yield
      end
    end
  end
end

namespace :gulp do
	desc "Compile files with Gulp"
	task :build do
		on roles :all do
			within fetch(:gulp_path, release_path) do
				execute :gulp, fetch(:node_env)
			end
		end
	end
end

set :forever_pid_path, -> {"#{shared_path}/player.pid"}

namespace :forever do
  set :command_start, -> { "NODE_ENV=#{fetch(:node_env)} forever start -a --pidFile #{fetch(:forever_pid_path)} --uid #{fetch(:node_env)}_player #{current_path}/app/bin/www" }
  set :command_restart, -> {"NODE_ENV=#{fetch(:node_env)} forever restart -a --pidFile #{fetch(:forever_pid_path)} --uid #{fetch(:node_env)}_player #{current_path}/app/bin/www"}
  set :command_stop, -> {"NODE_ENV=#{fetch(:node_env)} forever stop #{fetch(:node_env)}_player"}

  desc "restart forever"
  task :restart do
    on roles :all do
      within current_path do
        execute "#{fetch(:command_restart)} || #{fetch(:command_start)}"
      end
    end
  end

  desc "start forever"
  task :start do
    on roles :all do
      within current_path do
        execute fetch(:command_start)
      end
    end
  end

  desc "stop forever"
  task :stop do
    on roles :all do
      within current_path do
        execute fetch(:command_stop)
      end
    end
  end
end

after 'deploy:updated', 'npm:install'
after 'npm:install', 'gulp:build'
after 'deploy:published', 'forever:restart'

namespace :monit do
  desc "Setup all Monit configuration"
  task :setup do
    monit_config "forever_player"
    monit_reload
  end
end