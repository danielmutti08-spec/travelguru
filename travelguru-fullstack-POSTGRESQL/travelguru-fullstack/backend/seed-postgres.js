const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Sample articles from The Travel Guru designs
const articles = [
  {
    title: 'The Hidden Lagoons of Palawan',
    slug: 'hidden-lagoons-palawan',
    excerpt: 'Discover the secret lagoons and pristine beaches of Palawan, Philippines.',
    content: `Beyond the tourist trails of El Nido lies a network of hidden lagoons accessible only by kayak. These crystalline pools, surrounded by limestone cliffs, offer a glimpse into nature's untouched beauty.

## The Secret Entrance

Most visitors never discover these gems. The entrance is concealed behind a narrow rock formation that only appears during low tide. Local fishermen have known about these lagoons for generations, but they remain blissfully uncrowded.

## What to Expect

The water is so clear you can see tropical fish darting between coral formations 20 feet below. The lagoons are connected by underwater passages, creating a natural aquarium that changes with the tides.

### Best Time to Visit

- **Dry Season**: November to May
- **Ideal Months**: March and April
- **Avoid**: Monsoon season (June-October)

## Getting There

Hire a local guide from El Nido town. They know the tide schedules and secret passages. Expect to pay around $50 for a private tour.`,
    category: 'Adventure',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDha39NChc4ZtiZqrcjhVjfqmeWXCBq6-j0RVPnW2tmuPb4PHjLQSoWsgCDaAyZhiUTiiyV8ZiAT9PwxbsOgEz2RckbR1M-UOz3OVSayIwUMvcVkTSsV8btNN4Zr3kQD4hgXwGddpBuY1OGpFwIiPKrhhEOoMBKK1gjdStsIk4cuqPa_NKhsKWbN0IiF6nsN4WjiHWnCnCuv7PZdJjX0rML8f4RTA02EjzQ--IBAuwZi8nPg36vfo3n6Lq310tf5xjeqnob72_QSoM',
    location: 'Philippines',
    read_time: 8,
    published_date: '2024-01-15',
    status: 'published'
  },
  {
    title: 'Alpine Escapes: The Dolomites',
    slug: 'alpine-escapes-dolomites',
    excerpt: 'Experience the dramatic peaks and alpine meadows of Italy\'s Dolomites.',
    content: `The Dolomites rise from the Italian countryside like cathedral spires of stone. These UNESCO World Heritage mountains offer some of Europe's most spectacular hiking and climbing.

## The Tre Cime Loop

This iconic hike circles three massive peaks. The 6-mile loop takes about 4 hours and offers 360-degree views of jagged limestone formations.

### Trail Highlights

- Stunning sunrise views from Rifugio Auronzo
- Alpine lakes reflecting mountain peaks
- World War I trenches and tunnels
- Traditional mountain huts (rifugios) serving local cuisine

## Where to Stay

Stay in Cortina d'Ampezzo for luxury, or choose smaller villages like Ortisei for authentic alpine atmosphere.

## Best Season

Summer (June-September) offers the best hiking conditions. Winter transforms the region into a skiing paradise.`,
    category: 'Adventure',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW6n-wbrkcz3iLdjJQHRjnwRQKkVIFZaH1EOLK3cNPxwIkGvn9m9qRqKlCq7Xy3qgPetUcN3AqFxop2uqCV7pY49OOsRJaxTPgLYPv5yszMspQ9-ActE241h1LTpmfiHeObWChrIN9rRWhVwnDNbEWhfLQA7F_vF9d1w4iDo3SDSV45nCGPm-8_tjKrJqxoOiAWahDx0Any7_BcZvqwCD7lhJlLid-ZqniyNcEJgU_mC61a-KJeFdPj3T1dm-XkMo0Rqp2ErMJXuc',
    location: 'Italy',
    read_time: 10,
    published_date: '2024-01-20',
    status: 'published'
  },
  {
    title: 'Golden Sands of Morocco',
    slug: 'golden-sands-morocco',
    excerpt: 'Journey through Morocco\'s ancient medinas and vast desert landscapes.',
    content: `Morocco's golden cities and endless desert dunes create a sensory feast. From the maze-like medinas of Marrakech to the silence of the Sahara, this is travel at its most exotic.

## Marrakech Medina

Get lost in the labyrinthine souks where artisans still practice centuries-old crafts. The smell of spices, the sound of metalworkers, and the sight of vibrant textiles overwhelm the senses.

### Must-Visit Spots

- Jardin Majorelle: Yves Saint Laurent's blue garden oasis
- Bahia Palace: 19th-century architectural masterpiece
- Jemaa el-Fnaa: The main square comes alive at sunset

## Sahara Desert Experience

A night in the desert is essential. Ride camels into the dunes at sunset, sleep under a billion stars, and wake to the silent beauty of sunrise over endless sand.

## Travel Tips

- Visit in spring (March-May) or fall (September-November)
- Hire a local guide for medina exploration
- Respect local customs and dress modestly
- Bargain in the souks - it's expected`,
    category: 'Culture',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiem1Ut1k5MA0nfREWm02AHbMJldKu2tXYTuFgoqy320y0HMAGWA-3Ljf4qY2hTr9o8N8z1akVQnht3AXi8e97_M8hSHsgNxU_cZkWjnsVSB_CGB1zz9zP5jfpFA8rvbElovyDWXaUDlOaLTSuXm116zdBcDTzWD7hi56CPIHEnsZyuy5KcIzonjk7LMLqsbXtW3BqAREaTanjIRKmvfl9eaR62XUili8XajQUiz_GzaCe0tmY1_szHNjht5gJO8tgFAqZL4Zdryc',
    location: 'Morocco',
    read_time: 12,
    published_date: '2024-01-25',
    status: 'published'
  },
  {
    title: 'Hidden Gems of the Amalfi Coast',
    slug: 'hidden-gems-amalfi-coast',
    excerpt: 'Beyond the glittering facades of Positano and the bustling squares of Amalfi lies a different coast.',
    content: `Beyond the glittering facades of Positano and the bustling squares of Amalfi lies a different coast. One where lemon groves hang heavy over forgotten stone paths, and the only soundtrack is the distant hum of a fisherman's motorboat.

## The Forgotten Path to Ravello

While most visitors take the winding bus route up the mountain, those seeking true tranquility opt for the ancient mule tracks. These *scalinatella* (little stairs) weave through terrace after terrace of citrus trees. It is here that the scent of the Amalfi Coast truly reveals itself—a heady mix of salt air and ripening lemons.

> "The real magic of the coast isn't in the maps, but in the stairs you didn't plan to climb."
> 
> *Local Wisdom*

Reaching Ravello by foot rewards you with a perspective that no car can offer. You see the intricate irrigation systems built centuries ago, still feeding the lush gardens of Villa Cimbrone. By the time you reach the main square, the luxury of a cold *granita di limone* feels like a hard-earned prize.

## Praiano: The Quiet Middle

Often skipped in favor of its more famous neighbors, Praiano offers a genuine glimpse into coastal life. It's home to some of the most stunning sunsets on the peninsula. Unlike Positano, where the sun slips behind the mountains early, Praiano stays bathed in golden light until the final moments of the day.

### Where to Eat

- **La Brace**: Family-run trattoria with sea views
- **Il Pirata**: Beach club with fresh seafood
- **One Fire Beach**: Sunset cocktails and grilled fish

The town's main beach, Marina di Praia, sits in a tiny cove accessible by 400 steps. The descent might seem daunting, but the reward is a pebble beach bar serving some of the coast's best seafood, far from the crowds.

## Furore: The Hidden Fjord

Furore doesn't have a traditional town center. Instead, houses cling to the cliffside, connected by staircases painted with murals. The highlight is the *fiordo*, a tiny inlet where the Mediterranean squeezes between towering cliffs. A single bridge spans the gap, and every summer, international cliff divers compete here.

Few tourists make it to Furore, which means you'll have this dramatic coastline largely to yourself.`,
    category: 'Luxury',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8OIOkkorA_WTV6fuMRLjfb4zGcq1cOU6cAnk1KBfJqaExflaNQVCYIoLZcsLUH3RGYpvt7Sc70WKsj8sM_Lr-iWgu3SuKcql_nbrsIGCmwKCfuQGGTjSD2xbDuGxXGakofGSSUQwgpNwvXSr1fou1gaJX03q7pHvl9gaPrPq4SSBqdiwLsujnQor0h-WSOMpkCnk6tvb8XagaxwqAq_RTYYPcEd18mcT3eVdxi4T_mouHAyaRRhmlknnxeyYeuNjFJo62pOfyL3k',
    location: 'Italy',
    read_time: 15,
    published_date: '2024-02-01',
    status: 'published'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing articles
    await pool.query('DELETE FROM articles');
    console.log('🗑️  Cleared existing articles');
    
    // Insert articles
    for (const article of articles) {
      await pool.query(
        `INSERT INTO articles (title, slug, excerpt, content, category, image_url, location, read_time, published_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.content,
          article.category,
          article.image_url,
          article.location,
          article.read_time,
          article.published_date,
          article.status
        ]
      );
    }
    
    console.log('✅ Database populated with sample articles!');
    console.log(`📊 Inserted ${articles.length} articles`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();
