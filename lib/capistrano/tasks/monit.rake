namespace :monit do
  desc "Install Monit"
  task :install do
    on roles :all do
      execute :sudo, "yum -y install monit"
    end
  end
 
  desc "Start all service"
  task(:start_all) { monit_start_all }

  after "deploy:updated", :start_all

  %w[start stop restart status reload].each do |command|
    desc "Run Monit #{command} script"
    task command do
      on roles :all do
        execute :sudo, "service monit #{command}"
      end
    end
  end
end

def put_sudo(data, to)
  on roles :all do
    filename = File.basename(to)
    upload!  StringIO.new(data), "/tmp/#{filename}"
  end
end

def template_sudo(from, to)
  erb = File.read(File.expand_path("../templates/#{from}", __FILE__))
  put_sudo ERB.new(erb).result(binding), to
end

def monit_config(name, destination = nil)
  on roles(:all), in: :sequence do |server|
    destination ||= "/etc/monit.d/config.d/#{name}.conf"
    template_sudo "monit/#{name}.erb", "/tmp/monit_#{name}"
    execute :sudo, "mv -u /tmp/monit_#{name} #{destination}"
    execute :sudo, "chown root #{destination}"
    execute :sudo, "chmod 600 #{destination}"
  end
end

def monit_reload
  on roles :all do
    execute :sudo, "monit reload"
  end
end

def monit_start_all
  on roles :all do
    execute :sudo, "monit start all"
  end
end