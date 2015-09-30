set :stage, :staging

set :node_env, 'staging'

set :with_user, "sambaads"

server '54.152.255.43', user: fetch(:with_user), roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v0.12.2'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }

set :nginx_sever_name, "staging-player.sambaads.com"
set :nginx_host, "http://localhost:3000/"
set :nginx_file_name, "player.conf"