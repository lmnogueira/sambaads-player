set :stage, :production
set :branch, "master"
set :node_env, "production"
set :with_user, "sambaads"

set :server1, '52.201.230.77'
set :server2, '54.172.141.91'
set :server3, '52.90.63.130'

set :hostname_list, {server1: fetch(:server1), server2: fetch(:server2), server3: fetch(:server3)}

set :filter, hosts: fetch(:hostname_list).values

server fetch(:server1), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server2), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server3), user: fetch(:with_user), roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v4.4.0'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }

set :nginx_sever_name, "production-player.sambaads.com player.sambaads.com"
set :nginx_host, "http://localhost:3002/"
set :nginx_file_name, "player.conf"