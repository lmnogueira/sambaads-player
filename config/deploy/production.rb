set :stage, :production

set :node_env, 'production'

set :with_user, "sambaads"

set :hostname_list, {smartseed1: '52.7.210.178', smartseed2: '54.86.48.111'}

server fetch(:hostname_list)[:smartseed1], user: fetch(:with_user), roles: %w{app db web}
server fetch(:hostname_list)[:smartseed2], user: fetch(:with_user), roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v0.12.2'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--production --no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }