import React, { useState, useEffect } from "react";

export default function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeframe, setTimeframe] = useState("1d"); // 1d, 4h, 1w

  const FREE_NEWS_API_KEY = "YOUR_FREE_NEWSAPI_KEY";

  const targets = [
    {
      symbol: "ETH",
      name: "Ethereum",
      tp1: 4500,
      tp2: 7500,
      tp3: 12000,
      allocation: 1000,
      geckoId: "ethereum",
      subreddit: "ethereum",
    },
    {
      symbol: "XRP",
      name: "XRP",
      tp1: 3.5,
      tp2: 6.0,
      tp3: 12.0,
      allocation: 500,
      geckoId: "ripple",
      subreddit: "ripple",
    },
    {
      symbol: "ADA",
      name: "Cardano",
      tp1: 1.2,
      tp2: 2.8,
      tp3: 5.5,
      allocation: 300,
      geckoId: "cardano",
      subreddit: "cardano",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      tp1: 35,
      tp2: 75,
      tp3: 150,
      allocation: 400,
      geckoId: "chainlink",
      subreddit: "chainlink",
    },
    {
      symbol: "SOL",
      name: "Solana",
      tp1: 400,
      tp2: 650,
      tp3: 1000,
      allocation: 600,
      geckoId: "solana",
      subreddit: "solana",
    },
    {
      symbol: "VET",
      name: "VeChain",
      tp1: 0.45,
      tp2: 0.85,
      tp3: 1.5,
      allocation: 200,
      geckoId: "vechain",
      subreddit: "vechain",
    },
    {
      symbol: "SUI",
      name: "Sui",
      tp1: 8.0,
      tp2: 18.0,
      tp3: 35.0,
      allocation: 300,
      geckoId: "sui",
      subreddit: "sui",
    },
    {
      symbol: "INJ",
      name: "Injective",
      tp1: 45.0,
      tp2: 85.0,
      tp3: 150.0,
      allocation: 250,
      geckoId: "injective-protocol",
      subreddit: "injective",
    },
    {
      symbol: "LTC",
      name: "Litecoin",
      tp1: 180,
      tp2: 350,
      tp3: 600,
      allocation: 400,
      geckoId: "litecoin",
      subreddit: "litecoin",
    },
  ];

  // FREE Fibonacci Retracement Calculator
  const calculateFibonacci = (priceHistory) => {
    if (!priceHistory || priceHistory.length < 20) {
      return {
        levels: {},
        recentHigh: 0,
        recentLow: 0,
        currentLevel: null,
        signals: [],
      };
    }

    // Find recent swing high and low (last 30 periods)
    const recentPrices = priceHistory.slice(-30);
    const recentHigh = Math.max(...recentPrices);
    const recentLow = Math.min(...recentPrices);
    const currentPrice = priceHistory[priceHistory.length - 1];

    // Calculate Fibonacci levels
    const range = recentHigh - recentLow;
    const fibLevels = {
      "0%": recentHigh,
      "23.6%": recentHigh - range * 0.236,
      "38.2%": recentHigh - range * 0.382,
      "50%": recentHigh - range * 0.5,
      "61.8%": recentHigh - range * 0.618,
      "78.6%": recentHigh - range * 0.786,
      "100%": recentLow,
    };

    // Determine current position relative to Fib levels
    let currentLevel = null;
    let signals = [];
    const tolerance = range * 0.02; // 2% tolerance

    Object.entries(fibLevels).forEach(([level, price]) => {
      if (Math.abs(currentPrice - price) < tolerance) {
        currentLevel = level;

        if (level === "61.8%") {
          signals.push("🟢 At Golden Ratio (61.8%) - Strong Support");
        } else if (level === "38.2%") {
          signals.push("🟡 At 38.2% Retracement - Potential Bounce");
        } else if (level === "50%") {
          signals.push("🟡 At 50% Retracement - Key Level");
        } else if (level === "23.6%") {
          signals.push("🟢 Shallow Retracement (23.6%) - Bullish");
        }
      }
    });

    // Additional Fibonacci analysis
    if (currentPrice > fibLevels["23.6%"]) {
      signals.push("🟢 Above 23.6% - Uptrend Intact");
    } else if (currentPrice < fibLevels["61.8%"]) {
      signals.push("🔴 Below 61.8% - Deep Retracement");
    }

    return {
      levels: fibLevels,
      recentHigh,
      recentLow,
      currentLevel,
      signals,
      trend: currentPrice > fibLevels["50%"] ? "BULLISH" : "BEARISH",
    };
  };

  // FREE Elliott Wave Pattern Recognition
  const analyzeElliottWave = (priceHistory) => {
    if (!priceHistory || priceHistory.length < 50) {
      return {
        currentWave: "UNKNOWN",
        waveCount: 0,
        pattern: "INSUFFICIENT_DATA",
        signals: [],
        confidence: 0,
      };
    }

    // Simplified Elliott Wave detection
    const findPeaksAndTroughs = (prices, minDistance = 5) => {
      const peaks = [];
      const troughs = [];

      for (let i = minDistance; i < prices.length - minDistance; i++) {
        let isPeak = true;
        let isTrough = true;

        // Check if current point is higher/lower than surrounding points
        for (let j = 1; j <= minDistance; j++) {
          if (prices[i] <= prices[i - j] || prices[i] <= prices[i + j])
            isPeak = false;
          if (prices[i] >= prices[i - j] || prices[i] >= prices[i + j])
            isTrough = false;
        }

        if (isPeak) peaks.push({ index: i, price: prices[i], type: "peak" });
        if (isTrough)
          troughs.push({ index: i, price: prices[i], type: "trough" });
      }

      return [...peaks, ...troughs].sort((a, b) => a.index - b.index);
    };

    const pivots = findPeaksAndTroughs(priceHistory);

    if (pivots.length < 5) {
      return {
        currentWave: "INSUFFICIENT_PIVOTS",
        waveCount: 0,
        pattern: "UNCLEAR",
        signals: [],
        confidence: 0,
      };
    }

    // Analyze last 5 pivots for wave pattern
    const recentPivots = pivots.slice(-5);
    const currentPrice = priceHistory[priceHistory.length - 1];

    // Simple wave counting logic
    let waveCount = 0;
    let pattern = "SIDEWAYS";
    let signals = [];
    let confidence = 0;

    // Check for 5-wave impulse pattern (simplified)
    if (recentPivots.length >= 5) {
      const wave1 = recentPivots[1].price - recentPivots[0].price;
      const wave2 = recentPivots[2].price - recentPivots[1].price;
      const wave3 = recentPivots[3].price - recentPivots[2].price;
      const wave4 = recentPivots[4].price - recentPivots[3].price;

      // Look for bullish impulse pattern
      if (wave1 > 0 && wave2 < 0 && wave3 > 0 && wave4 < 0) {
        if (
          Math.abs(wave3) > Math.abs(wave1) &&
          Math.abs(wave3) > Math.abs(wave2)
        ) {
          pattern = "BULLISH_IMPULSE";
          waveCount = 4; // Assume we're in wave 4
          signals.push("🟢 Bullish Impulse Pattern - Wave 4 Correction");
          signals.push("🎯 Expect Wave 5 Rally Soon");
          confidence = 70;
        }
      }

      // Look for bearish impulse pattern
      else if (wave1 < 0 && wave2 > 0 && wave3 < 0 && wave4 > 0) {
        if (
          Math.abs(wave3) > Math.abs(wave1) &&
          Math.abs(wave3) > Math.abs(wave2)
        ) {
          pattern = "BEARISH_IMPULSE";
          waveCount = 4;
          signals.push("🔴 Bearish Impulse Pattern - Wave 4 Rally");
          signals.push("⚠️ Expect Wave 5 Decline");
          confidence = 70;
        }
      }

      // Look for ABC correction
      else if (recentPivots.length >= 3) {
        const lastThree = recentPivots.slice(-3);
        if (lastThree[0].type !== lastThree[2].type) {
          pattern = "ABC_CORRECTION";
          signals.push("🟡 ABC Correction Pattern");
          confidence = 50;
        }
      }
    }

    // Current wave analysis
    let currentWave = "UNKNOWN";
    if (pattern === "BULLISH_IMPULSE") {
      if (currentPrice < recentPivots[recentPivots.length - 1].price) {
        currentWave = "WAVE_4_CORRECTION";
        signals.push("💎 Wave 4 - Hold for Wave 5");
      } else {
        currentWave = "WAVE_5_RALLY";
        signals.push("🚀 Wave 5 Rally - Take Profits Above Previous High");
      }
    } else if (pattern === "BEARISH_IMPULSE") {
      currentWave = "WAVE_4_OR_5";
      signals.push("📉 Bearish Pattern - Consider Exit");
    } else if (pattern === "ABC_CORRECTION") {
      currentWave = "CORRECTIVE_PHASE";
      signals.push("🔄 Correction Phase - Wait for Completion");
    }

    return {
      currentWave,
      waveCount,
      pattern,
      signals,
      confidence,
      pivots: recentPivots,
    };
  };

  // Enhanced Technical Analysis with Fib + Elliott
  const calculateAdvancedTechnicalIndicators = (priceHistory) => {
    if (!priceHistory || priceHistory.length < 14) {
      return {
        rsi: 50,
        macd: { macd: 0, signal: 0, histogram: 0 },
        sma20: 0,
        sma50: 0,
        bollinger: { upper: 0, middle: 0, lower: 0 },
        fibonacci: { levels: {}, signals: [] },
        elliottWave: { currentWave: "UNKNOWN", signals: [] },
        trend: "NEUTRAL",
        momentum: "NEUTRAL",
      };
    }

    // Previous technical indicators
    const calculateRSI = (prices, period = 14) => {
      let gains = 0;
      let losses = 0;

      for (let i = 1; i <= period && i < prices.length; i++) {
        const change =
          prices[prices.length - i] - prices[prices.length - i - 1];
        if (change > 0) gains += change;
        else losses -= change;
      }

      if (losses === 0) return 100;
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / avgLoss;
      return 100 - 100 / (1 + rs);
    };

    const calculateSMA = (prices, period) => {
      if (prices.length < period) return prices[prices.length - 1];
      const slice = prices.slice(-period);
      return slice.reduce((a, b) => a + b, 0) / period;
    };

    const calculateMACD = (prices) => {
      const ema12 = calculateSMA(prices.slice(-12), 12);
      const ema26 = calculateSMA(prices.slice(-26), 26);
      const macd = ema12 - ema26;
      const signal = macd * 0.15;

      return {
        macd,
        signal,
        histogram: macd - signal,
      };
    };

    const calculateBollingerBands = (prices, period = 20) => {
      const sma = calculateSMA(prices, period);
      const slice = prices.slice(-period);
      const variance =
        slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) /
        period;
      const stdDev = Math.sqrt(variance);

      return {
        upper: sma + stdDev * 2,
        middle: sma,
        lower: sma - stdDev * 2,
      };
    };

    // Calculate all indicators
    const rsi = calculateRSI(priceHistory);
    const macd = calculateMACD(priceHistory);
    const sma20 = calculateSMA(priceHistory, 20);
    const sma50 = calculateSMA(priceHistory, 50);
    const bollinger = calculateBollingerBands(priceHistory);

    // NEW: Add Fibonacci and Elliott Wave
    const fibonacci = calculateFibonacci(priceHistory);
    const elliottWave = analyzeElliottWave(priceHistory);

    return {
      rsi,
      macd,
      sma20,
      sma50,
      bollinger,
      fibonacci,
      elliottWave,
      trend: sma20 > sma50 ? "BULLISH" : "BEARISH",
      momentum: rsi > 70 ? "OVERBOUGHT" : rsi < 30 ? "OVERSOLD" : "NEUTRAL",
      currentPrice: priceHistory[priceHistory.length - 1],
    };
  };

  // Enhanced Confluence Score with Fib + Elliott Wave
  const calculateEnhancedConfluenceScore = (
    coin,
    technical,
    social,
    fearGreed,
    news,
    github
  ) => {
    let score = 0;
    let signals = [];

    // Technical Analysis (50 points - increased from 40)
    let technicalScore = 0;

    // RSI signals
    if (technical.rsi < 30) {
      technicalScore += 10;
      signals.push("🟢 RSI Oversold - Buy Signal");
    } else if (technical.rsi > 70) {
      technicalScore -= 6;
      signals.push("🔴 RSI Overbought - Sell Signal");
    }

    // MACD signals
    if (technical.macd.histogram > 0 && technical.trend === "BULLISH") {
      technicalScore += 8;
      signals.push("🟢 MACD Bullish Momentum");
    }

    // Fibonacci signals (NEW - 15 points)
    if (technical.fibonacci.signals) {
      technical.fibonacci.signals.forEach((signal) => {
        if (
          signal.includes("Strong Support") ||
          signal.includes("Golden Ratio")
        ) {
          technicalScore += 12;
          signals.push(signal);
        } else if (
          signal.includes("Potential Bounce") ||
          signal.includes("Uptrend Intact")
        ) {
          technicalScore += 8;
          signals.push(signal);
        } else if (signal.includes("Deep Retracement")) {
          technicalScore -= 5;
          signals.push(signal);
        } else {
          technicalScore += 4;
          signals.push(signal);
        }
      });
    }

    // Elliott Wave signals (NEW - 15 points)
    if (technical.elliottWave.signals) {
      technical.elliottWave.signals.forEach((signal) => {
        if (
          signal.includes("Wave 5 Rally") ||
          signal.includes("Bullish Impulse")
        ) {
          technicalScore += 10;
          signals.push(signal);
        } else if (signal.includes("Wave 4") && signal.includes("Hold")) {
          technicalScore += 8;
          signals.push(signal);
        } else if (signal.includes("Bearish Pattern")) {
          technicalScore -= 8;
          signals.push(signal);
        } else {
          technicalScore += 4;
          signals.push(signal);
        }
      });
    }

    // Moving average trend
    if (technical.trend === "BULLISH") {
      technicalScore += 6;
      signals.push("🟢 SMA20 > SMA50 (Uptrend)");
    }

    // Bollinger Bands
    if (coin.currentPrice < technical.bollinger.lower) {
      technicalScore += 8;
      signals.push("🟢 Below Bollinger Lower Band");
    }

    // Social Sentiment (30 points - reduced from 35)
    let socialScore = 0;

    if (fearGreed.value < 25) {
      socialScore += 12;
      signals.push("🟢 Extreme Fear - Buy Opportunity");
    } else if (fearGreed.value > 75) {
      socialScore -= 8;
      signals.push("🔴 Extreme Greed - Sell Signal");
    }

    if (social.sentiment > 0.7) {
      socialScore += 6;
      signals.push("🟢 Positive Reddit Sentiment");
    }

    if (social.engagement > 1000) {
      socialScore += 6;
      signals.push("🟢 High Community Engagement");
    }

    if (news.sentiment > 0.6) {
      socialScore += 6;
      signals.push("🟢 Positive News Coverage");
    }

    // Price Action (20 points - reduced from 25)
    let priceScore = 0;

    const distanceToTP1 = (coin.tp1 - coin.currentPrice) / coin.currentPrice;
    if (distanceToTP1 > 0.3) {
      priceScore += 12;
      signals.push("🟢 Significant Upside to TP1");
    } else if (distanceToTP1 < 0.05) {
      priceScore -= 8;
      signals.push("🔴 Near TP1 - Take Profits");
    }

    if (github.recentActivity === "HIGH") {
      priceScore += 4;
      signals.push("🟢 High Developer Activity");
    }

    // Calculate final scores
    technicalScore = Math.max(0, Math.min(50, technicalScore));
    socialScore = Math.max(0, Math.min(30, socialScore));
    priceScore = Math.max(0, Math.min(20, priceScore));

    score = technicalScore + socialScore + priceScore;

    // Generate recommendation
    let recommendation = "";
    if (score >= 75) recommendation = "STRONG BUY";
    else if (score >= 55) recommendation = "BUY";
    else if (score >= 35) recommendation = "HOLD";
    else if (score >= 20) recommendation = "WEAK SELL";
    else recommendation = "STRONG SELL";

    // Enhanced confidence calculation
    let confidence = Math.min(95, signals.length * 6 + score * 0.6);

    // Boost confidence for Fibonacci + Elliott Wave confluence
    if (
      technical.fibonacci.signals?.length > 0 &&
      technical.elliottWave.confidence > 60
    ) {
      confidence += 10;
      signals.push("⭐ Fibonacci + Elliott Wave Confluence");
    }

    return {
      totalScore: score,
      technicalScore,
      socialScore,
      priceScore,
      recommendation,
      confidence: Math.min(95, confidence),
      signals: signals.slice(0, 8), // Show top 8 signals
      breakdown: {
        technical: `${technicalScore}/50`,
        social: `${socialScore}/30`,
        price: `${priceScore}/20`,
      },
    };
  };

  // Get timeframe data from CoinGecko - UPDATED for 4h, 1d, 1w
  const getTimeframeQuery = (timeframe) => {
    switch (timeframe) {
      case "4h":
        return { days: 7, interval: "hourly" };
      case "1d":
        return { days: 30, interval: "daily" };
      case "1w":
        return { days: 365, interval: "daily" };
      default:
        return { days: 30, interval: "daily" };
    }
  };

  // [Previous functions remain the same: fetchFearGreedIndex, fetchRedditSentiment, etc.]
  const fetchFearGreedIndex = async () => {
    try {
      const response = await fetch("https://api.alternative.me/fng/");
      const data = await response.json();
      return {
        value: parseInt(data.data[0].value),
        classification: data.data[0].value_classification,
        timestamp: data.data[0].timestamp,
      };
    } catch (error) {
      return { value: 50, classification: "Neutral", timestamp: Date.now() };
    }
  };

  const fetchRedditSentiment = async (subreddit) => {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`
      );
      const data = await response.json();

      if (!data.data || !data.data.children) {
        return { sentiment: 0.5, postCount: 0, engagement: 0 };
      }

      const posts = data.data.children;
      let totalSentiment = 0;
      let totalEngagement = 0;

      const positiveWords = [
        "moon",
        "bullish",
        "pump",
        "buy",
        "hold",
        "diamond",
        "rocket",
        "green",
        "profit",
        "gain",
      ];
      const negativeWords = [
        "dump",
        "crash",
        "bearish",
        "sell",
        "fear",
        "red",
        "loss",
        "down",
        "panic",
        "drop",
      ];

      posts.forEach((post) => {
        const text = (
          post.data.title +
          " " +
          (post.data.selftext || "")
        ).toLowerCase();
        const upvotes = post.data.ups || 0;
        const comments = post.data.num_comments || 0;

        let sentiment = 0.5;

        positiveWords.forEach((word) => {
          if (text.includes(word)) sentiment += 0.1;
        });

        negativeWords.forEach((word) => {
          if (text.includes(word)) sentiment -= 0.1;
        });

        sentiment = Math.max(0, Math.min(1, sentiment));
        totalSentiment += sentiment;
        totalEngagement += upvotes + comments;
      });

      return {
        sentiment: posts.length > 0 ? totalSentiment / posts.length : 0.5,
        postCount: posts.length,
        engagement: totalEngagement,
      };
    } catch (error) {
      return { sentiment: 0.5, postCount: 0, engagement: 0 };
    }
  };

  const fetchNewsSentiment = async (symbol) => {
    if (!FREE_NEWS_API_KEY || FREE_NEWS_API_KEY === "YOUR_FREE_NEWSAPI_KEY") {
      return { sentiment: 0.5, articleCount: 0, relevance: 0 };
    }

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${symbol}&sortBy=publishedAt&pageSize=20&apiKey=${FREE_NEWS_API_KEY}`
      );
      const data = await response.json();

      if (!data.articles)
        return { sentiment: 0.5, articleCount: 0, relevance: 0 };

      const articles = data.articles;
      let totalSentiment = 0;

      const positiveWords = [
        "surge",
        "rally",
        "bull",
        "gain",
        "rise",
        "breakthrough",
        "adoption",
        "partnership",
      ];
      const negativeWords = [
        "crash",
        "fall",
        "bear",
        "decline",
        "drop",
        "regulatory",
        "ban",
        "concern",
      ];

      articles.forEach((article) => {
        const text = (
          article.title +
          " " +
          (article.description || "")
        ).toLowerCase();
        let sentiment = 0.5;

        positiveWords.forEach((word) => {
          if (text.includes(word)) sentiment += 0.15;
        });

        negativeWords.forEach((word) => {
          if (text.includes(word)) sentiment -= 0.15;
        });

        sentiment = Math.max(0, Math.min(1, sentiment));
        totalSentiment += sentiment;
      });

      return {
        sentiment: articles.length > 0 ? totalSentiment / articles.length : 0.5,
        articleCount: articles.length,
        relevance:
          articles.length > 5 ? "HIGH" : articles.length > 2 ? "MEDIUM" : "LOW",
      };
    } catch (error) {
      return { sentiment: 0.5, articleCount: 0, relevance: 0 };
    }
  };

  const fetchDeveloperActivity = async (symbol) => {
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${symbol}+cryptocurrency&sort=updated&per_page=10`
      );
      const data = await response.json();

      if (!data.items)
        return { repoCount: 0, totalStars: 0, recentActivity: "LOW" };

      const repos = data.items.filter(
        (repo) =>
          repo.name.toLowerCase().includes(symbol.toLowerCase()) ||
          repo.description?.toLowerCase().includes(symbol.toLowerCase())
      );

      const totalStars = repos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0
      );
      const recentUpdates = repos.filter((repo) => {
        const lastUpdate = new Date(repo.updated_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return lastUpdate > thirtyDaysAgo;
      }).length;

      return {
        repoCount: repos.length,
        totalStars,
        recentActivity:
          recentUpdates > 5 ? "HIGH" : recentUpdates > 2 ? "MEDIUM" : "LOW",
      };
    } catch (error) {
      return { repoCount: 0, totalStars: 0, recentActivity: "LOW" };
    }
  };

  // Main data fetching function
  const fetchAllData = async () => {
    setLoading(true);

    try {
      // Get timeframe parameters
      const { days, interval } = getTimeframeQuery(timeframe);

      // Fetch prices
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${targets
          .map((t) => t.geckoId)
          .join(
            ","
          )}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );
      const priceData = await priceResponse.json();

      // Fetch price history with selected timeframe
      const historyPromises = targets.map((coin) =>
        fetch(
          `https://api.coingecko.com/api/v3/coins/${coin.geckoId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
        )
          .then((res) => res.json())
          .catch(() => ({ prices: [] }))
      );
      const historyData = await Promise.all(historyPromises);

      // Fetch Fear & Greed Index
      const fearGreed = await fetchFearGreedIndex();

      // Process each coin
      const enrichedData = await Promise.all(
        targets.map(async (coin, index) => {
          const geckoData = priceData[coin.geckoId];
          const currentPrice = geckoData?.usd || 0;
          const change24h = geckoData?.usd_24h_change || 0;
          const volume24h = geckoData?.usd_24h_vol || 0;

          // Get price history for technical analysis
          const priceHistory = historyData[index]?.prices?.map((p) => p[1]) || [
            currentPrice,
          ];

          // Enhanced technical analysis with Fib + Elliott Wave
          const technical = calculateAdvancedTechnicalIndicators(priceHistory);

          // Fetch social data
          const social = await fetchRedditSentiment(coin.subreddit);
          const news = await fetchNewsSentiment(coin.symbol);
          const github = await fetchDeveloperActivity(coin.symbol);

          // Enhanced confluence score
          const confluence = calculateEnhancedConfluenceScore(
            { ...coin, currentPrice },
            technical,
            social,
            fearGreed,
            news,
            github
          );

          return {
            ...coin,
            currentPrice,
            change24h,
            volume24h,
            technical,
            social,
            news,
            github,
            confluence,
            progressTP1: Math.min((currentPrice / coin.tp1) * 100, 100),
            progressTP2: Math.min((currentPrice / coin.tp2) * 100, 100),
            progressTP3: Math.min((currentPrice / coin.tp3) * 100, 100),
          };
        })
      );

      setCryptoData(enrichedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 120000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case "STRONG BUY":
        return "#10b981";
      case "BUY":
        return "#34d399";
      case "HOLD":
        return "#fbbf24";
      case "WEAK SELL":
        return "#f97316";
      case "STRONG SELL":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getConfidenceEmoji = (confidence) => {
    if (confidence >= 85) return "🎯";
    if (confidence >= 70) return "💎";
    if (confidence >= 55) return "👍";
    if (confidence >= 40) return "🤔";
    return "⚠️";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b, #7c3aed, #1e293b)",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
            background: "linear-gradient(45deg, #10b981, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🚀 Professional Confluence System
        </h1>
        <p style={{ color: "#d1d5db", fontSize: "16px", marginBottom: "15px" }}>
          Technical + Social +{" "}
          <span style={{ color: "#fbbf24", fontWeight: "bold" }}>
            Fibonacci + Elliott Wave
          </span>{" "}
          Analysis
        </p>

        {/* Timeframe Selector - UPDATED */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px", color: "#9ca3af" }}>
            Timeframe:
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{
              background: "#374151",
              color: "white",
              border: "1px solid #6b7280",
              borderRadius: "6px",
              padding: "8px 12px",
              marginRight: "20px",
            }}
          >
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day (Recommended)</option>
            <option value="1w">1 Week</option>
          </select>

          <button
            onClick={fetchAllData}
            disabled={loading}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "🔄 Analyzing..." : "🔄 Refresh"}
          </button>
        </div>

        {/* New Features Badge */}
        <div
          style={{
            display: "inline-flex",
            gap: "10px",
            background: "rgba(251, 191, 36, 0.1)",
            border: "1px solid #fbbf24",
            borderRadius: "20px",
            padding: "8px 16px",
            fontSize: "12px",
            marginBottom: "20px",
          }}
        >
          <span style={{ color: "#fbbf24" }}>
            🆕 NEW: Fibonacci Retracements
          </span>
          <span style={{ color: "#8b5cf6" }}>
            🆕 NEW: Elliott Wave Analysis
          </span>
        </div>
      </div>

      {/* Enhanced Crypto Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "25px",
          maxWidth: "1800px",
          margin: "0 auto",
        }}
      >
        {cryptoData.map((coin) => (
          <div
            key={coin.symbol}
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              border: `2px solid ${getRecommendationColor(
                coin.confluence?.recommendation
              )}`,
              borderRadius: "20px",
              padding: "25px",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Enhanced Recommendation Badge */}
            <div
              style={{
                position: "absolute",
                top: "-12px",
                right: "20px",
                background: getRecommendationColor(
                  coin.confluence?.recommendation
                ),
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {getConfidenceEmoji(coin.confluence?.confidence)}{" "}
              {coin.confluence?.recommendation}
            </div>

            {/* Coin Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <div>
                <h3
                  style={{ margin: "0", fontSize: "20px", fontWeight: "bold" }}
                >
                  {coin.name}
                </h3>
                <p style={{ margin: "4px 0 0 0", color: "#9ca3af" }}>
                  {coin.symbol} • {timeframe} timeframe
                </p>
              </div>
              <div
                style={{
                  color: coin.change24h >= 0 ? "#10b981" : "#ef4444",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {coin.change24h >= 0 ? "📈 +" : "📉 "}
                {Math.abs(coin.change24h).toFixed(2)}%
              </div>
            </div>

            {/* Price & Technical Summary */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                $
                {coin.currentPrice?.toLocaleString(undefined, {
                  maximumFractionDigits: coin.currentPrice < 1 ? 6 : 2,
                })}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  display: "flex",
                  gap: "15px",
                  marginTop: "5px",
                }}
              >
                <span>RSI: {coin.technical?.rsi?.toFixed(1)}</span>
                <span>Trend: {coin.technical?.trend}</span>
                <span>Elliott: {coin.technical?.elliottWave?.currentWave}</span>
              </div>
            </div>

            {/* Enhanced Confluence Score */}
            <div
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#8b5cf6" }}>
                  Enhanced Confluence
                </span>
                <span style={{ fontWeight: "bold", color: "#ffffff" }}>
                  {coin.confluence?.totalScore}/100 (
                  {coin.confluence?.confidence?.toFixed(0)}%)
                </span>
              </div>

              <div
                style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
              >
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    Technical+Fib+Elliott
                  </div>
                  <div style={{ fontWeight: "bold", color: "#fbbf24" }}>
                    {coin.confluence?.breakdown.technical}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    Social
                  </div>
                  <div style={{ fontWeight: "bold", color: "#10b981" }}>
                    {coin.confluence?.breakdown.social}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    Price
                  </div>
                  <div style={{ fontWeight: "bold", color: "#8b5cf6" }}>
                    {coin.confluence?.breakdown.price}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#374151",
                  height: "6px",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: getRecommendationColor(
                      coin.confluence?.recommendation
                    ),
                    height: "100%",
                    width: `${coin.confluence?.totalScore}%`,
                    transition: "width 0.5s ease",
                  }}
                ></div>
              </div>
            </div>

            {/* Fibonacci Levels */}
            {coin.technical?.fibonacci?.levels &&
              Object.keys(coin.technical.fibonacci.levels).length > 0 && (
                <div
                  style={{
                    background: "rgba(251, 191, 36, 0.1)",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "15px",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      color: "#fbbf24",
                      fontSize: "13px",
                    }}
                  >
                    📐 Fibonacci Levels
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "4px",
                      fontSize: "11px",
                    }}
                  >
                    {Object.entries(coin.technical.fibonacci.levels)
                      .slice(1, -1)
                      .map(([level, price]) => (
                        <div
                          key={level}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color:
                              Math.abs(coin.currentPrice - price) <
                              coin.currentPrice * 0.02
                                ? "#fbbf24"
                                : "#d1d5db",
                          }}
                        >
                          <span>{level}:</span>
                          <span>
                            ${price.toFixed(coin.currentPrice < 1 ? 6 : 2)}
                          </span>
                        </div>
                      ))}
                  </div>
                  {coin.technical.fibonacci.currentLevel && (
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "11px",
                        color: "#fbbf24",
                      }}
                    >
                      📍 Currently at {coin.technical.fibonacci.currentLevel}{" "}
                      level
                    </div>
                  )}
                </div>
              )}

            {/* Elliott Wave Analysis */}
            {coin.technical?.elliottWave?.pattern !== "INSUFFICIENT_DATA" && (
              <div
                style={{
                  background: "rgba(168, 85, 247, 0.1)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "#a855f7",
                    fontSize: "13px",
                  }}
                >
                  🌊 Elliott Wave
                </h4>
                <div style={{ fontSize: "11px" }}>
                  <div style={{ marginBottom: "4px" }}>
                    Pattern:{" "}
                    <span style={{ color: "#ffffff", fontWeight: "bold" }}>
                      {coin.technical.elliottWave.pattern}
                    </span>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    Current:{" "}
                    <span style={{ color: "#ffffff", fontWeight: "bold" }}>
                      {coin.technical.elliottWave.currentWave}
                    </span>
                  </div>
                  {coin.technical.elliottWave.confidence > 0 && (
                    <div>
                      Confidence:{" "}
                      <span
                        style={{
                          color:
                            coin.technical.elliottWave.confidence > 60
                              ? "#10b981"
                              : "#fbbf24",
                        }}
                      >
                        {coin.technical.elliottWave.confidence}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Key Signals */}
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: "#fbbf24",
                  fontSize: "14px",
                }}
              >
                🎯 Professional Signals ({coin.confluence?.signals?.length || 0}
                )
              </h4>
              <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                {coin.confluence?.signals?.map((signal, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "10px",
                      padding: "3px 6px",
                      margin: "2px 0",
                      background: "rgba(71, 85, 105, 0.3)",
                      borderRadius: "8px",
                      color: signal.includes("🟢")
                        ? "#10b981"
                        : signal.includes("🔴")
                        ? "#ef4444"
                        : signal.includes("⭐")
                        ? "#fbbf24"
                        : "#d1d5db",
                    }}
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Progress */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {[
                {
                  label: "TP1",
                  value: coin.tp1,
                  progress: coin.progressTP1,
                  color: "#fbbf24",
                },
                {
                  label: "TP2",
                  value: coin.tp2,
                  progress: coin.progressTP2,
                  color: "#10b981",
                },
                {
                  label: "TP3",
                  value: coin.tp3,
                  progress: coin.progressTP3,
                  color: "#8b5cf6",
                },
              ].map((target) => (
                <div key={target.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ color: target.color }}>
                      {target.label}: ${target.value.toLocaleString()}
                    </span>
                    <span>{target.progress.toFixed(0)}%</span>
                  </div>
                  <div
                    style={{
                      background: "#374151",
                      height: "4px",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: target.color,
                        height: "100%",
                        width: `${target.progress}%`,
                        transition: "width 0.3s",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          color: "#9ca3af",
          fontSize: "14px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          🏆 <strong>PROFESSIONAL GRADE</strong> • Fibonacci + Elliott Wave +
          Social Confluence
        </div>
        <div style={{ marginBottom: "5px" }}>
          📊 Timeframe: {timeframe} • Sources: CoinGecko + Reddit + Fear&Greed +
          GitHub
        </div>
        <div>
          Last updated: {lastUpdated?.toLocaleTimeString()} | Next update in 2
          minutes
        </div>
      </div>
    </div>
  );
}
