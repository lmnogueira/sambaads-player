set :stage, :production
set :branch, 'master'

set :node_env, 'production'

set :with_user, "sambaads"

# set :smartseed1, '52.7.210.178'
# set :smartseed2, '54.86.48.111'
set :smartseed3, '52.91.150.219'

#set :smartseed1, '52.201.230.77'
#set :smartseed2, '54.172.141.91'
#set :smartseed3, '52.90.63.130'


#set :smartseed1, '52.201.230.77'
#set :smartseed2, '54.172.141.91'
#set :smartseed3, '52.90.63.130'

set :hostname_list, {smartseed1: fetch(:smartseed1), smartseed2: fetch(:smartseed2)}

#server fetch(:smartseed1), user: fetch(:with_user), roles: %w{app db web}
#server fetch(:smartseed2), user: fetch(:with_user), roles: %w{app db web}
server fetch(:smartseed3), user: fetch(:with_user), roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v0.12.2'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }

set :nginx_sever_name, "production-player.sambaads.com player.sambaads.com"
set :nginx_host, "http://localhost:3002/"
set :nginx_file_name, "player.conf"