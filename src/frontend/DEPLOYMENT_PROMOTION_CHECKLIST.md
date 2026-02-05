# Deployment Promotion Checklist

This document outlines the steps to promote the current preview build to the public production URL.

## Prerequisites

Before promoting to production, ensure:

- [ ] The preview build is working correctly and has been tested
- [ ] All features function as expected in the preview environment
- [ ] The backend canister is deployed and responding
- [ ] All environment variables are correctly configured
- [ ] Assets (images, fonts, etc.) are loading properly

## Promotion Steps

### 1. Verify Preview Build

Visit your preview URL and confirm:
- [ ] Application loads without errors
- [ ] All pages and routes are accessible
- [ ] Interactive elements work correctly
- [ ] No console errors in browser developer tools
- [ ] Responsive design works on mobile and desktop

### 2. Backend Verification

Ensure the backend is ready:
- [ ] Backend canister is deployed to the correct network
- [ ] Canister IDs match between frontend configuration and deployed canisters
- [ ] Backend methods are accessible and returning expected data
- [ ] No authentication or permission issues

### 3. Deploy to Production

Using your deployment platform (e.g., caffeine.ai, dfx, or other ICP deployment tools):

1. **Identify the current preview build/version number**
   - Note the exact commit hash or version identifier

2. **Promote the build to production**
   - Use your platform's promotion/publish command
   - For caffeine.ai: Use the "Make it public" option in the UI
   - For manual dfx deployment: Run `dfx deploy --network ic`

3. **Update DNS/routing (if applicable)**
   - Ensure production domain points to the correct canister
   - Verify SSL certificates are valid

### 4. Post-Deployment Verification

After promotion, test the production URL:

- [ ] Open production URL in a **fresh incognito/private browser window** (no cached credentials)
- [ ] Verify the application loads correctly
- [ ] Test core functionality:
  - [ ] Landing page displays properly
  - [ ] Navigation works
  - [ ] All sections render correctly
  - [ ] Images and assets load
- [ ] Check browser console for errors
- [ ] Test on multiple devices (desktop, mobile, tablet)
- [ ] Verify both light and dark themes work

### 5. Monitoring

After going live:

- [ ] Monitor application logs for errors
- [ ] Check canister cycles/resources
- [ ] Verify analytics/tracking is working (if configured)
- [ ] Monitor user feedback channels

## Rollback Plan

If issues are discovered after promotion:

1. **Immediate rollback**: Revert to the previous production version using your platform's rollback feature
2. **Investigate**: Review logs and error reports to identify the issue
3. **Fix in preview**: Make necessary fixes and test in preview environment
4. **Re-promote**: Once fixed and verified, promote again following this checklist

## Troubleshooting

### Common Issues

**Application won't load:**
- Check canister ID configuration in `frontend/env.json` or environment variables
- Verify backend canister is running: `dfx canister status backend --network ic`
- Check browser console for specific error messages

**Assets not loading:**
- Verify asset canister is deployed and accessible
- Check CORS configuration if using external assets
- Ensure asset paths are correct (relative vs absolute)

**Backend connection errors:**
- Confirm backend canister ID matches frontend configuration
- Verify network configuration (local vs IC mainnet)
- Check that backend methods exist and are public (query/update)

**Blank page or white screen:**
- Check for JavaScript errors in browser console
- Verify all dependencies are included in the build
- Ensure routing is configured correctly

### Getting Help

If you encounter issues during promotion:
1. Check the deployment platform's documentation
2. Review Internet Computer documentation at https://internetcomputer.org/docs
3. Contact your deployment platform's support team

## Notes

- This checklist assumes you are using the caffeine.ai platform or similar ICP deployment tooling
- Always test in preview before promoting to production
- Keep a record of each deployment (version, date, changes)
- Consider implementing a staging environment for larger applications

---

**Last Updated:** February 5, 2026
**Version:** 1.0
