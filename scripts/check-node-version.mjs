const major = Number(process.version.slice(1).split(".")[0]);

if (major !== 24) {
  console.error(
    `Node ${process.version} is not supported. This repo requires Node 24 LTS.\n` +
      `Run: nvm use   (or fnm use / mise use)`
  );
  process.exit(1);
}
