set :stage, :staging
set :branch, 'NEW_jwplayer_version_7'

set :node_env, 'staging'

set :with_user, "sambaads"

server 'staging.ycontent.com', roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v4.4.0'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }

set :nginx_sever_name, "staging-v2-player.sambaads.com"
set :nginx_host, "http://localhost:3002/"
set :nginx_file_name, "player.conf"
