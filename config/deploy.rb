# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'widget-player'
set :repo_url, 'git@widget_player.github.com:sambaads/sambaads-player.git'

set :branch, 'master'

set :deploy_to, '/app/widget_player'

set :scm, :git

# Default value for :pty is false
# set :pty, true

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

namespace :forever do
  desc "restart forever"
  task :restart do
    on roles :all do
      within release_path do
        execute :forever, :stopall
        execute "NODE_ENV=#{fetch(:node_env)} forever start #{release_path}/app/bin/www"
      end
    end
  end

  desc "start forever"
  task :start do
    within release_path do
      execute "NODE_ENV=#{fetch(:node_env)} forever start #{release_path}/app/bin/www"
    end
  end

  desc "stop forever"
  task :stop do
    within release_path do
      execute :forever, :stopall
    end
  end
end

after 'deploy:updated', 'npm:install'
after 'npm:install', 'gulp:build'
after 'gulp:build', 'forever:restart'