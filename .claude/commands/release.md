Create a new release for this npm package.

## Steps

1. **Ask for version bump type** using AskUserQuestion with options:
   - patch (1.0.x)
   - minor (1.x.0)
   - major (x.0.0)
   - use current (no bump)

2. **If bumping version**, run:
   ```bash
   npm version <type> --no-git-tag-version
   ```

3. **Build the project**:
   ```bash
   yarn build
   ```
   Stop if build fails.

4. **Read the new version** from package.json

5. **If version was bumped**, commit with message matching the version number (e.g., "1.0.8")

6. **Create and push git tag**:
   ```bash
   git tag v{version}
   git push origin v{version}
   ```

7. **Create GitHub release**:
   ```bash
   gh release create v{version} --generate-notes
   ```

Report progress at each step. The GitHub release will automatically trigger npm publishing via the publish.yml workflow.
