npm run build:all

cp package.json dist/package.json

cp README.md dist/README.md

cd dist

rm -rf docs

npm publish