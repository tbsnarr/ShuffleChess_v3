# Shuffle Chess

A browser based chess variant. Play standard chess; after every three individual moves (plies), all the pieces on each side randomly trade squares. The shuffled positions are allowed to be illegal by standard chess rules.

## Play locally

Open `index.html` in a modern browser with an internet connection. The game uses chess.js from esm.sh for move generation and standard chess rules between shuffles.

## Publish on GitHub Pages

1. Upload `index.html` to the root of a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. GitHub will provide the published site URL after deployment.

For a separately named second version, upload `index-v2.html` too. Its URL will end in `/index-v2.html`.
