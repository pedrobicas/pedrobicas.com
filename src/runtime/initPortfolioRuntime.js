import { createRuntimeContext } from './createRuntimeContext.js';
import { createLiveVisuals } from './liveVisuals.js';
import { setupTypography } from './setupTypography.js';
import { setupHero } from './setupHero.js';
import { setupTerminal } from './setupTerminal.js';
import { setupStackAndJourney } from './setupStackAndJourney.js';
import { setupProjects } from './setupProjects.js';
import { setupContact } from './setupContact.js';
import { setupGallery } from './setupGallery.js';
import { setupCursor } from './setupCursor.js';
import { setupNavigation } from './setupNavigation.js';
import { setupIntroAndLayout } from './setupIntroAndLayout.js';

export function initPortfolioRuntime() {
  const ctx = createRuntimeContext();
  const live = createLiveVisuals(ctx);
  setupTypography(ctx);
  setupHero(ctx);
  setupStackAndJourney(ctx);
  setupProjects(ctx, live);
  setupContact(ctx);
  setupGallery(ctx, live);
  setupCursor(ctx);
  setupNavigation(ctx);
  setupTerminal(ctx);
  setupIntroAndLayout(ctx);
  return () => ctx.destroy();
}
