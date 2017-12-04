module.exports = {
	apps: [{
			name: "api",
			script: "bin/www",
			watch: true,
			cwd: "backend/",
			env: {
				"NODE_ENV": "production",
				"PORT": 3000
			}
		},
		{
			name: "client",
			script: "build-scripts/prod.js",
			watch: true,
			cwd: "client/",
			args: 'start',
			ignore_watch: '__clientTemp',
			env: {
				"NODE_ENV": "production",
				"PORT": 3001
			}
		}
	]
};
