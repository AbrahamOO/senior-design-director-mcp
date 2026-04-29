/**
 * Performance Advisor Tool
 * Provides performance optimization recommendations based on Core Web Vitals (web)
 * and native mobile performance metrics (iOS & Android)
 */

import { PerformanceRecommendation, Platform } from '../types/index.js';

function analyzeWarmLaunch(isIOS: boolean, warmLaunchMs?: number): PerformanceRecommendation[] {
  if (warmLaunchMs === undefined || warmLaunchMs <= 400) return [];
  const firstRec = isIOS
    ? 'Ensure viewDidLoad / viewWillAppear do not reload data from scratch on every foreground — use diff/cache'
    : 'Ensure Activity.onStart() does not re-initialize state that is already cached in the ViewModel';
  return [{
    category: 'App Launch — Warm Start',
    current: `${warmLaunchMs}ms`,
    target: '<200ms',
    recommendations: [
      firstRec,
      'Cache last-known good data locally and display it immediately while refreshing in background',
      'Avoid full-view recreation on warm launch — check if scene/activity is being unnecessarily destroyed'
    ],
    priority: 'high'
  }];
}

const COLD_START_RECS_IOS = [
  'Defer all work until after applicationDidBecomeActive — do not block didFinishLaunchingWithOptions',
  'Avoid synchronous network calls, heavy disk I/O, or database queries at launch',
  'Use background initialization for non-critical services (analytics, logging)',
  'Pre-warm launch screen with a launch storyboard that matches your first screen layout to avoid visual jarring',
  'Instrument with MetricKit or Xcode Organizer launch time metric to find bottlenecks',
  'Eliminate unused initializers in Swift — static let singletons that run expensive setup at app start',
];

const COLD_START_RECS_ANDROID = [
  'Avoid heavy work in Application.onCreate() — defer to background threads or lazy initialization',
  'Use App Startup library to sequence and parallelize component initialization',
  'Defer SDK initializations (analytics, crash reporting) with 500ms delay after first Activity resumes',
  'Enable R8 full mode for aggressive code shrinking (reduces dex size, speeds class loading)',
  'Profile with Android Studio Profiler (CPU Trace) — look for long sequences in main thread at startup',
  'Use Baseline Profiles to pre-compile critical code paths via ART (improves cold start 20–40%)',
];

function analyzeAppLaunch(
  platform: Platform,
  coldLaunchMs?: number,
  warmLaunchMs?: number
): PerformanceRecommendation[] {
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const coldTarget = isIOS ? 400 : 500;
  const coldPoor = isIOS ? 600 : 800;
  const results: PerformanceRecommendation[] = [];

  if (coldLaunchMs !== undefined) {
    if (coldLaunchMs > coldPoor) {
      results.push({
        category: 'App Launch — Cold Start',
        current: `${coldLaunchMs}ms`,
        target: `<${coldTarget}ms`,
        recommendations: isIOS ? COLD_START_RECS_IOS : COLD_START_RECS_ANDROID,
        priority: 'high',
      });
    } else if (coldLaunchMs > coldTarget) {
      const syncRead = isIOS
        ? 'Check for synchronous UserDefaults / NSKeyedUnarchiver reads blocking the main thread'
        : 'Check for synchronous SharedPreferences reads on the main thread';
      results.push({
        category: 'App Launch — Cold Start',
        current: `${coldLaunchMs}ms`,
        target: `<${coldTarget}ms for excellent`,
        recommendations: [
          'Review work done before first frame — anything above 200ms should be audited',
          'Use lazy loading for features not needed on launch screen',
          syncRead,
        ],
        priority: 'medium',
      });
    }
  }

  return [...results, ...analyzeWarmLaunch(isIOS, warmLaunchMs)];
}

function analyzeFrameRate(platform: Platform, frameRate?: number): PerformanceRecommendation[] {
  if (frameRate === undefined || frameRate >= 60) return [];
  const isIOS = platform === 'mobile-ios' || platform === 'both';

  if (frameRate < 30) {
    return [{
      category: 'Frame Rate — Severe Jank',
      current: `${frameRate}fps`,
      target: '60fps (16ms per frame budget)',
      recommendations: isIOS ? [
        'Profile with Instruments > Core Animation — identify offscreen rendering and blended layers',
        'Eliminate UIView.layer.shouldRasterize on scrolling views — causes compositing overhead',
        'Avoid modifying UIView.layer.cornerRadius on animated views — use CAShapeLayer mask instead',
        'Move image decoding off the main thread using ImageIO + background queue',
        'Use UICollectionView with cell prefetching (prefetchDataSource) to prepare cells before they appear',
        'Reduce view hierarchy depth — flatten where possible, avoid unnecessary UIView wrappers'
      ] : [
        'Profile with Android Studio GPU Rendering / Systrace — identify long frames (>16ms)',
        'Avoid overdraw — use "Show Overdraw Areas" in Developer Options (maximum 2-3 layers)',
        'Replace View.setLayerType(LAYER_TYPE_SOFTWARE) with hardware acceleration',
        'Move RecyclerView item decoration rendering off the main thread',
        'Use Compose LazyColumn with keys for stable identity — prevents unnecessary recompositions',
        'Reduce nested layouts — use ConstraintLayout or Compose instead of nested LinearLayouts'
      ],
      priority: 'high'
    }];
  }

  return [{
    category: 'Frame Rate — Minor Jank',
    current: `${frameRate}fps`,
    target: '60fps consistent (no dropped frames)',
    recommendations: [
      'Use profiler during scroll and animation to catch occasional frame drops',
      isIOS
        ? 'Check for main-thread Core Data fetches during scroll — use background context with NSFetchedResultsController'
        : 'Check for main-thread database queries during scroll — use Room DAO with suspend functions',
      'Review list cell/item bind logic — keep bindView/onBindViewHolder under 2ms'
    ],
    priority: 'medium'
  }];
}

function analyzeMemoryUsage(platform: Platform, memoryMb?: number): PerformanceRecommendation[] {
  if (memoryMb === undefined) return [];
  const isIOS = platform === 'mobile-ios' || platform === 'both';
  const warningThreshold = isIOS ? 150 : 200;
  const criticalThreshold = isIOS ? 300 : 350;

  if (memoryMb > criticalThreshold) {
    return [{
      category: 'Memory Usage — Critical',
      current: `${memoryMb}MB`,
      target: `<${warningThreshold}MB typical usage`,
      recommendations: isIOS ? [
        'Respond to didReceiveMemoryWarning — release all caches, non-visible images, and prefetched data',
        'Use NSCache instead of NSDictionary for image/data caches — auto-evicts under memory pressure',
        'Profile with Instruments > Allocations — look for retain cycles and unbounded caches',
        'Set UIImage.preparingThumbnail(of:) for thumbnail display — never load full-res into a thumbnail slot',
        'Paginate large data sets — never load entire dataset into memory for a list',
        'Use weak references for delegate patterns to prevent retain cycles that accumulate over time'
      ] : [
        'Register ActivityLifecycleCallbacks to trim caches on onTrimMemory(TRIM_MEMORY_UI_HIDDEN)',
        'Use Coil/Glide memory cache limits — cap at 20% of available heap',
        'Profile with Android Studio Memory Profiler — look for leaked Activities, Contexts, and Bitmaps',
        'Recycle Bitmaps explicitly when done (pre-Lollipop) or use Coil/Glide which handles this automatically',
        'Paginate with Paging 3 library — never load unbounded lists into a ViewModel',
        'Avoid leaking Context into singletons — use applicationContext for long-lived objects'
      ],
      priority: 'high'
    }];
  }

  if (memoryMb > warningThreshold) {
    return [{
      category: 'Memory Usage — Elevated',
      current: `${memoryMb}MB`,
      target: `<${warningThreshold}MB`,
      recommendations: [
        'Review image loading strategy — use appropriate thumbnail sizes, not full-resolution images in lists',
        isIOS
          ? 'Use NSCache with countLimit and totalCostLimit to bound in-memory image cache'
          : 'Set explicit memory cache size in Coil/Glide ImageLoader configuration',
        'Audit for retained references across screen navigations — use memory profiler after navigating back'
      ],
      priority: 'medium'
    }];
  }

  return [];
}

function analyzeBatteryAndAssets(
  platform: Platform,
  batteryImpact?: 'low' | 'moderate' | 'high',
  assetDensities?: boolean
): PerformanceRecommendation[] {
  const results: PerformanceRecommendation[] = [];
  const isIOS = platform === 'mobile-ios' || platform === 'both';

  if (batteryImpact === 'high') {
    results.push({
      category: 'Battery Impact',
      current: 'High battery drain detected',
      target: 'Minimal background battery usage',
      recommendations: isIOS ? [
        'Move background work to BGTaskScheduler (BGProcessingTask / BGAppRefreshTask) — never use Timer in background',
        'Use CLLocationManager with significantLocationChanges instead of continuous GPS tracking',
        'Reduce animation frame rate with CADisplayLink.preferredFrameRateRange when not in foreground',
        'Audit for background URLSession tasks that run unnecessarily frequently',
        'Use UIBackgroundTaskIdentifier only for short-lived completion tasks (<30 seconds)',
        'Profile with Instruments > Energy Log — look for CPU wake-ups and excessive radio usage'
      ] : [
        'Use WorkManager for deferrable background tasks — system schedules at optimal battery time',
        'Avoid WakeLock — use JobScheduler / WorkManager constraints instead',
        'Use PRIORITY_BALANCED_POWER_ACCURACY for location in non-navigation contexts',
        'Batch network requests — avoid frequent small requests, use exponential backoff for polling',
        'Profile with Android Studio Energy Profiler — look for wakelock holds and network bursts',
        'Use Doze mode safe APIs — test by forcing Doze with `adb shell dumpsys deviceidle force-idle`'
      ],
      priority: 'high'
    });
  }

  if (assetDensities === false) {
    results.push({
      category: 'Asset Densities',
      current: 'Missing asset density variants',
      target: isIOS ? 'All three: @1x, @2x, @3x' : 'All five: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi',
      recommendations: isIOS ? [
        'Provide @1x, @2x, @3x in the .xcassets image catalog for all raster assets',
        '@3x (180+ ppi) covers iPhone 14 Pro, 15 Pro, and all "Super Retina" displays',
        '@2x (2× scale) covers iPhone SE, most standard iPhones, and all iPads',
        'Use PDF vector assets in .xcassets with "Preserve Vector Data" for icons — scales to any density',
        'For SF Symbols, use UIImage.systemImage — no density variants needed',
        'Ensure app icon has all required sizes in AppIcon asset catalog (20pt–1024pt)'
      ] : [
        'Place assets in drawable-mdpi, drawable-hdpi, drawable-xhdpi, drawable-xxhdpi, drawable-xxxhdpi',
        'Most modern Android phones are xxhdpi (480dpi) or xxxhdpi (640dpi)',
        'Use vector drawables (SVG-like XML) for icons — single file scales to all densities',
        'For photos/bitmaps, provide xxhdpi as minimum; xxxhdpi for flagship devices',
        'Use Android Studio Vector Asset Studio to convert SVGs to VectorDrawable',
        'Check with Density Tester app or Device File Explorer to verify correct assets are loading'
      ],
      priority: 'high'
    });
  }

  return results;
}

export function analyzeMobilePerformance(options: {
  platform: Platform;
  coldLaunchMs?: number;
  warmLaunchMs?: number;
  frameRate?: number;
  memoryUsageMb?: number;
  batteryImpact?: 'low' | 'moderate' | 'high';
  assetDensities?: boolean;
}): {
  success: boolean;
  message: string;
  recommendations?: PerformanceRecommendation[];
  overallScore?: number;
} {
  const all: PerformanceRecommendation[] = [
    ...analyzeAppLaunch(options.platform, options.coldLaunchMs, options.warmLaunchMs),
    ...analyzeFrameRate(options.platform, options.frameRate),
    ...analyzeMemoryUsage(options.platform, options.memoryUsageMb),
    ...analyzeBatteryAndAssets(options.platform, options.batteryImpact, options.assetDensities),
  ];

  const highCount = all.filter(r => r.priority === 'high').length;
  const score = Math.max(0, 100 - highCount * 20 - all.filter(r => r.priority === 'medium').length * 5);

  let grade = 'Excellent mobile performance.';
  if (score < 90) grade = 'Good, with room for improvement.';
  if (score < 75) grade = 'Address high-priority items before shipping.';
  if (score < 50) grade = 'Critical performance issues — users will notice.';

  return {
    success: true,
    message: `Mobile performance analysis (${options.platform}) complete. Score: ${score}/100. ${grade}`,
    recommendations: all,
    overallScore: score,
  };
}

export function getMobilePerformanceTargets(): {
  success: boolean;
  ios: { metric: string; good: string; acceptable: string; poor: string; tool: string }[];
  android: { metric: string; good: string; acceptable: string; poor: string; tool: string }[];
} {
  return {
    success: true,
    ios: [
      { metric: 'Cold Launch Time', good: '<400ms', acceptable: '400–600ms', poor: '>600ms', tool: 'Xcode Organizer / MetricKit' },
      { metric: 'Warm Launch Time', good: '<200ms', acceptable: '200–400ms', poor: '>400ms', tool: 'Xcode Instruments — Time Profiler' },
      { metric: 'Frame Rate (scroll/animation)', good: '60fps (ProMotion: 120fps)', acceptable: '45–59fps', poor: '<45fps', tool: 'Instruments — Core Animation FPS' },
      { metric: 'Peak Memory', good: '<150MB', acceptable: '150–300MB', poor: '>300MB (jettison risk)', tool: 'Instruments — Allocations / Leaks' },
      { metric: 'App Binary Size (download)', good: '<25MB', acceptable: '25–50MB', poor: '>50MB (user hesitation)', tool: 'App Store Connect — App Size Report' },
      { metric: 'Main Thread Blocking', good: '<16ms per frame', acceptable: '16–32ms', poor: '>32ms (visible drop)', tool: 'Instruments — Time Profiler' },
      { metric: 'Network (3G loading)', good: '<3s first meaningful paint', acceptable: '3–5s', poor: '>5s', tool: 'Charles Proxy / Network Link Conditioner' },
      { metric: 'Battery Impact (background)', good: 'None / negligible', acceptable: 'Low (2–5% per hour active)', poor: '>5% per hour background', tool: 'Instruments — Energy Log' },
    ],
    android: [
      { metric: 'Cold Start Time', good: '<500ms', acceptable: '500–800ms', poor: '>800ms', tool: 'Android Studio Profiler / ADB logcat ActivityTaskManager' },
      { metric: 'Warm Start Time', good: '<200ms', acceptable: '200–400ms', poor: '>400ms', tool: 'Android Studio Profiler' },
      { metric: 'Frame Rate (scroll/animation)', good: '60fps', acceptable: '45–59fps', poor: '<45fps', tool: 'GPU Rendering Profile / Systrace / Perfetto' },
      { metric: 'Peak Memory (heap)', good: '<200MB', acceptable: '200–350MB', poor: '>350MB (OOM risk)', tool: 'Android Studio Memory Profiler' },
      { metric: 'APK / AAB Size', good: '<25MB download', acceptable: '25–50MB', poor: '>50MB (conversion drop)', tool: 'Play Console — Android Vitals' },
      { metric: 'Main Thread Frame Time', good: '<16ms', acceptable: '16–32ms', poor: '>32ms', tool: 'Systrace / Perfetto' },
      { metric: 'Jank Rate (frames >16ms)', good: '<5% of frames', acceptable: '5–10%', poor: '>10%', tool: 'Android Vitals / adb shell dumpsys gfxinfo' },
      { metric: 'ANR Rate', good: '<0.1%', acceptable: '0.1–0.47%', poor: '>0.47% (Play Store warning)', tool: 'Play Console — Android Vitals' },
    ]
  };
}

export function analyzePerformance(options: {
  lcp?: number; // Largest Contentful Paint in ms
  fid?: number; // First Input Delay in ms
  cls?: number; // Cumulative Layout Shift
  bundleSize?: number; // JS bundle size in KB
  imageOptimization?: 'none' | 'partial' | 'full';
  lazyLoading?: boolean;
  caching?: 'none' | 'partial' | 'full';
  fontLoading?: 'blocking' | 'swap' | 'optional';
}): {
  success: boolean;
  message: string;
  recommendations?: PerformanceRecommendation[];
  overallScore?: number;
} {
  const recommendations: PerformanceRecommendation[] = [];
  let score = 100;

  // Check LCP (Largest Contentful Paint)
  if (options.lcp !== undefined) {
    if (options.lcp > 2500) {
      recommendations.push({
        category: 'Largest Contentful Paint (LCP)',
        current: `${options.lcp}ms`,
        target: '<2.5s (2500ms)',
        recommendations: [
          'Optimize and compress hero images (use WebP/AVIF with JPEG fallback)',
          'Preload critical resources: <link rel="preload" as="image" href="hero.webp">',
          'Use CDN for static assets to reduce server response time',
          'Eliminate render-blocking resources in <head>',
          'Consider using next/image or similar for automatic optimization',
          'Lazy-load below-fold images to prioritize hero content'
        ],
        priority: 'high'
      });
      score -= 20;
    } else if (options.lcp > 1800) {
      recommendations.push({
        category: 'Largest Contentful Paint (LCP)',
        current: `${options.lcp}ms`,
        target: '<1.8s for excellent performance',
        recommendations: [
          'Good performance, but can be optimized further',
          'Review image sizes and ensure proper compression',
          'Consider preconnect to external domains: <link rel="preconnect" href="https://cdn.example.com">'
        ],
        priority: 'medium'
      });
      score -= 5;
    }
  }

  // Check FID (First Input Delay)
  if (options.fid !== undefined) {
    if (options.fid > 100) {
      recommendations.push({
        category: 'First Input Delay (FID)',
        current: `${options.fid}ms`,
        target: '<100ms',
        recommendations: [
          'Break up long JavaScript tasks (>50ms)',
          'Use code splitting to reduce main thread blocking',
          'Defer non-critical JavaScript with defer or async attributes',
          'Implement progressive hydration for React/Vue apps',
          'Use Web Workers for heavy computations off main thread',
          'Minimize third-party script impact'
        ],
        priority: 'high'
      });
      score -= 20;
    } else if (options.fid > 50) {
      recommendations.push({
        category: 'First Input Delay (FID)',
        current: `${options.fid}ms`,
        target: '<50ms for excellent',
        recommendations: [
          'Review JavaScript execution time during page load',
          'Consider lazy-loading non-critical components'
        ],
        priority: 'low'
      });
      score -= 5;
    }
  }

  // Check CLS (Cumulative Layout Shift)
  if (options.cls !== undefined) {
    if (options.cls > 0.1) {
      recommendations.push({
        category: 'Cumulative Layout Shift (CLS)',
        current: `${options.cls}`,
        target: '<0.1',
        recommendations: [
          'Always include width and height attributes on images and videos',
          'Reserve space for ads, embeds, and iframes with min-height',
          'Avoid inserting content above existing content (except in response to user action)',
          'Use font-display: swap with fallback font sizing to match web font',
          'Preload fonts: <link rel="preload" as="font" href="font.woff2" crossorigin>',
          'Use CSS aspect-ratio for responsive images: aspect-ratio: 16 / 9'
        ],
        priority: 'high'
      });
      score -= 20;
    } else if (options.cls > 0.05) {
      recommendations.push({
        category: 'Cumulative Layout Shift (CLS)',
        current: `${options.cls}`,
        target: '<0.05 for excellent',
        recommendations: [
          'Review any dynamically injected content',
          'Ensure all images have dimensions specified'
        ],
        priority: 'medium'
      });
      score -= 5;
    }
  }

  // Check bundle size
  if (options.bundleSize !== undefined) {
    if (options.bundleSize > 200) {
      recommendations.push({
        category: 'JavaScript Bundle Size',
        current: `${options.bundleSize}KB`,
        target: '<100KB gzipped',
        recommendations: [
          'Analyze bundle with webpack-bundle-analyzer or similar',
          'Remove unused dependencies and dead code',
          'Implement code splitting for route-based chunks',
          'Lazy-load components that are below the fold',
          'Use tree-shaking to eliminate unused exports',
          'Consider lighter alternatives to heavy libraries (e.g., date-fns instead of moment)',
          'Enable gzip/brotli compression on server'
        ],
        priority: 'high'
      });
      score -= 15;
    } else if (options.bundleSize > 100) {
      recommendations.push({
        category: 'JavaScript Bundle Size',
        current: `${options.bundleSize}KB`,
        target: '<100KB for optimal performance',
        recommendations: [
          'Good size, but review for any optimization opportunities',
          'Ensure code splitting is implemented for routes'
        ],
        priority: 'medium'
      });
      score -= 5;
    }
  }

  // Check image optimization
  if (options.imageOptimization === 'none') {
    recommendations.push({
      category: 'Image Optimization',
      current: 'No optimization detected',
      target: 'Modern formats with responsive sizes',
      recommendations: [
        'Convert images to WebP/AVIF with JPEG fallback using <picture> element',
        'Implement responsive images with srcset for different screen sizes',
        'Compress images (TinyPNG, ImageOptim, or build-time optimization)',
        'Lazy-load images below the fold: loading="lazy" attribute',
        'Use appropriate image dimensions (don\'t scale large images with CSS)',
        'Consider using an image CDN (Cloudinary, imgix) for automatic optimization'
      ],
      priority: 'high'
    });
    score -= 15;
  } else if (options.imageOptimization === 'partial') {
    recommendations.push({
      category: 'Image Optimization',
      current: 'Partial optimization',
      target: 'Full modern format support',
      recommendations: [
        'Ensure all images use WebP/AVIF with fallbacks',
        'Implement lazy-loading for all below-fold images',
        'Review image compression settings'
      ],
      priority: 'medium'
    });
    score -= 5;
  }

  // Check lazy loading
  if (options.lazyLoading === false) {
    recommendations.push({
      category: 'Lazy Loading',
      current: 'Not implemented',
      target: 'Lazy-load below-fold content',
      recommendations: [
        'Add loading="lazy" to all images below the fold',
        'Use Intersection Observer for custom lazy-loading logic',
        'Lazy-load non-critical components and routes',
        'Defer loading of analytics and tracking scripts'
      ],
      priority: 'medium'
    });
    score -= 10;
  }

  // Check caching
  if (options.caching === 'none') {
    recommendations.push({
      category: 'Caching Strategy',
      current: 'No caching detected',
      target: 'Aggressive caching for static assets',
      recommendations: [
        'Set Cache-Control headers for static assets (1 year for immutable files)',
        'Use content hashing in filenames (app.[hash].js) for cache busting',
        'Implement service worker for offline support and caching',
        'Use CDN for global edge caching',
        'Cache API responses with appropriate strategies (stale-while-revalidate)'
      ],
      priority: 'high'
    });
    score -= 15;
  } else if (options.caching === 'partial') {
    recommendations.push({
      category: 'Caching Strategy',
      current: 'Basic caching',
      target: 'Comprehensive caching strategy',
      recommendations: [
        'Review cache headers for all asset types',
        'Consider implementing service worker for advanced caching'
      ],
      priority: 'medium'
    });
    score -= 5;
  }

  // Check font loading
  if (options.fontLoading === 'blocking') {
    recommendations.push({
      category: 'Font Loading',
      current: 'Blocking font loading',
      target: 'Non-blocking with fallbacks',
      recommendations: [
        'Use font-display: swap for web fonts to prevent FOIT (Flash of Invisible Text)',
        'Preload critical fonts: <link rel="preload" as="font" href="font.woff2" crossorigin>',
        'Subset fonts to include only used characters (Latin, numbers, etc)',
        'Use variable fonts to reduce number of font files',
        'Consider system font stack as fallback: -apple-system, BlinkMacSystemFont, "Segoe UI"',
        'Self-host fonts instead of using Google Fonts for better control'
      ],
      priority: 'medium'
    });
    score -= 10;
  }

  const overallScore = Math.max(0, score);
  let message = `Performance analysis complete. Overall score: ${overallScore}/100.`;

  if (overallScore >= 90) {
    message += ' Excellent performance!';
  } else if (overallScore >= 75) {
    message += ' Good performance with room for improvement.';
  } else if (overallScore >= 50) {
    message += ' Moderate performance. Address high priority items.';
  } else {
    message += ' Poor performance. Immediate optimization required.';
  }

  return {
    success: true,
    message,
    recommendations,
    overallScore
  };
}

export function getCoreWebVitalsTargets(): {
  success: boolean;
  targets: {
    metric: string;
    good: string;
    needsImprovement: string;
    poor: string;
    description: string;
    impact: string;
  }[];
} {
  return {
    success: true,
    targets: [
      {
        metric: 'Largest Contentful Paint (LCP)',
        good: '<2.5s',
        needsImprovement: '2.5s - 4.0s',
        poor: '>4.0s',
        description: 'Measures loading performance. LCP marks the point when the largest content element is visible.',
        impact: 'Critical for perceived load speed. Slow LCP frustrates users waiting for main content.'
      },
      {
        metric: 'First Input Delay (FID)',
        good: '<100ms',
        needsImprovement: '100ms - 300ms',
        poor: '>300ms',
        description: 'Measures interactivity. FID quantifies the delay when user first interacts with page.',
        impact: 'Affects user experience during initial interactions. High FID makes site feel unresponsive.'
      },
      {
        metric: 'Cumulative Layout Shift (CLS)',
        good: '<0.1',
        needsImprovement: '0.1 - 0.25',
        poor: '>0.25',
        description: 'Measures visual stability. CLS quantifies unexpected layout shifts during page load.',
        impact: 'Poor CLS causes accidental clicks and frustration. Common with ads, embeds, and web fonts.'
      },
      {
        metric: 'First Contentful Paint (FCP)',
        good: '<1.8s',
        needsImprovement: '1.8s - 3.0s',
        poor: '>3.0s',
        description: 'Measures when first content appears. FCP marks when any text/image is first rendered.',
        impact: 'Early signal to user that page is loading. Fast FCP reduces perceived wait time.'
      },
      {
        metric: 'Time to Interactive (TTI)',
        good: '<3.8s',
        needsImprovement: '3.8s - 7.3s',
        poor: '>7.3s',
        description: 'Measures when page becomes fully interactive and responds reliably to user input.',
        impact: 'Long TTI frustrates users who try to interact before page is ready.'
      },
      {
        metric: 'Total Blocking Time (TBT)',
        good: '<200ms',
        needsImprovement: '200ms - 600ms',
        poor: '>600ms',
        description: 'Measures total time that main thread was blocked, preventing user input.',
        impact: 'High TBT causes laggy, unresponsive feel during page load.'
      }
    ]
  };
}

export function getPerformanceBudget(): {
  success: boolean;
  budget: {
    resource: string;
    budget: string;
    reasoning: string;
  }[];
} {
  return {
    success: true,
    budget: [
      {
        resource: 'JavaScript (total)',
        budget: '<100KB gzipped',
        reasoning: 'Reduces parse/compile time. Each 100KB adds ~1s on average mobile device.'
      },
      {
        resource: 'CSS (total)',
        budget: '<50KB gzipped',
        reasoning: 'CSS is render-blocking. Keep minimal for fast first paint.'
      },
      {
        resource: 'Images (above fold)',
        budget: '<200KB total',
        reasoning: 'Critical for LCP. Compress and use modern formats (WebP/AVIF).'
      },
      {
        resource: 'Fonts',
        budget: '<100KB total',
        reasoning: 'Web fonts delay text rendering. Subset and preload critical fonts.'
      },
      {
        resource: 'Third-party scripts',
        budget: '<50KB',
        reasoning: 'Third-party JS is often unoptimized. Defer or async load when possible.'
      },
      {
        resource: 'Total page weight',
        budget: '<1MB',
        reasoning: 'On 4G, 1MB takes ~1-2s to download. Every MB adds significant load time.'
      },
      {
        resource: 'HTTP requests',
        budget: '<50 requests',
        reasoning: 'Each request has overhead. Combine resources and use HTTP/2 multiplexing.'
      },
      {
        resource: 'LCP element',
        budget: '<2.5s',
        reasoning: 'Google ranking factor. Affects SEO and user satisfaction.'
      }
    ]
  };
}
