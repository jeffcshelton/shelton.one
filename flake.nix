{
  description = "shelton.one development shell.";

  inputs = {
    flake-utils = {
      inputs.systems.follows = "systems";
      url = "github:numtide/flake-utils";
    };

    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = { self, flake-utils, nixpkgs, ... }:
  {
    nixosModules.default = { config, pkgs, lib, ... }:
    let
      cfg = config.services."shelton.one";
      pkg = self.packages.${pkgs.system}.default;
    in
    {
      # Create a new service option for the website that can be enabled.
      options.services."shelton.one" = {
        enable = lib.mkEnableOption "Enable serving the shelton.one website.";
        user = lib.mkOption {
          default = "www";
          description = "The name of the user to be created to run the server.";
          type = lib.types.str;
        };
      };

      config = lib.mkIf cfg.enable {
        systemd.services."shelton.one" = {
          # Require the service to start after networking is up.
          after = [ "network.target" ];

          enable = true;
          description = "shelton.one web server";

          serviceConfig = {
            # Give privileges to bind to port 80.
            AmbientCapabilities = [ "CAP_NET_BIND_SERVICE" ];
            Environment = "PORT=80";

            # Start the service with Node.js.
            ExecStart = "${pkgs.nodejs_24}/bin/node ${pkg}/server/index.mjs";

            # Always restart the service if it crashes.
            Restart = "always";

            # Run with the "www" user, created below for security.
            User = "www";

            WorkingDirectory = "${pkg}";
          };

          wantedBy = [ "multi-user.target" ];
        };

        users = {
          groups.www = {};

          users.${cfg.user} = {
            createHome = false;
            description = "Hosts the shelton.one web server.";
            group = "www";
            hashedPassword = "!";
            isSystemUser = true;
            shell = "${pkgs.shadow}/bin/nologin";
          };
        };
      };
    };
  } // flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        config.allowUnfree = true;
        system = "${system}";
      };
    in
    {
      devShells.default = pkgs.mkShell {
        buildInputs = [ pkgs.nodejs_24 ];
        name = "shelton.one";
        version = "1.0.0";
      };

      packages.default = pkgs.buildNpmPackage {
        installPhase = ''
          mkdir -p $out
          cp -r .output/. $out/
        '';
        npmDepsHash = "sha256-AbraXPL4osQhymS6t1tY6aohjcO1wLhjOCIANMyBNCo=";
        pname = "shelton.one";
        src = self;
        version = "1.0.0";
      };
    }
  );
}
