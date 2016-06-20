set :stage, :production
set :branch, 'master'

set :node_env, 'production'

set :with_user, "sambaads"

#HOSTS=52.7.210.178,54.86.48.111,52.87.230.121 bundle exec cap production deploy
set :server1, '52.7.210.178'
set :server2, '54.86.48.111'
set :server3, '52.87.230.121'

#HOSTS=52.201.230.77,54.172.141.91,52.90.63.130 bundle exec cap production deploy
set :server4, '52.201.230.77'
set :server5, '54.172.141.91'
set :server6, '52.90.63.130'

set :hostname_list, {server1: fetch(:server1), server2: fetch(:server2), server3: fetch(:server3), server4: fetch(:server4), server5: fetch(:server5), server6: fetch(:server6)}
set :filter, hosts: fetch(:hostname_list).values

server fetch(:server1), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server2), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server3), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server4), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server5), user: fetch(:with_user), roles: %w{app db web}
server fetch(:server6), user: fetch(:with_user), roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v0.12.2'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }

set :nginx_sever_name, "production-player.sambaads.com player.sambaads.com"
set :nginx_host, "http://localhost:3002/"
set :nginx_file_name, "player.conf"