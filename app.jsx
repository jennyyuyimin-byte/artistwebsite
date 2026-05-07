// Jenny Yu — single scrolling page

const { useState, useEffect, useRef } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "videoUrl": "https://player.vimeo.com/video/1030155753?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&dnt=1",
  "showGrain": true
}/*EDITMODE-END*/;

const NAV = [
  { id: 'about',      label: 'About' },
  { id: 'collection', label: 'Collection' },
  { id: 'projects',   label: 'Projects' },
  { id: 'commission', label: 'Commission' },
  { id: 'open-call',  label: 'Open Call' },
  { id: 'contact',    label: 'Contact' },
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);

  // Nav state on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section active highlight via IntersectionObserver
  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <VideoBackdrop url={tweaks.videoUrl} grain={tweaks.showGrain} />

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Jenny Yu<span className="brand-tln">Private Gallery</span>
        </button>
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-link ${active === n.id ? 'active' : ''}`}
              onClick={() => goTo(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="page">
        <Hero />
        <AboutSection />
        <Divider mark="✦" />
        <CollectionSection />
        <Divider mark="❍" />
        <ProjectsSection />
        <Divider mark="❅" />
        <CommissionSection />
        <Divider mark="✧" />
        <OpenCallSection />
        <Divider mark="✦" />
        <ContactSection />
        <Footer />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Background">
          <TweakText label="Video URL" value={tweaks.videoUrl} onChange={(v) => setTweak('videoUrl', v)} />
          <TweakToggle label="Film grain" value={tweaks.showGrain} onChange={(v) => setTweak('showGrain', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function VideoBackdrop({ url, grain }) {
  let src = url;
  const m = url && url.match(/vimeo\.com\/(\d+)/);
  if (m && !url.includes('player.vimeo.com')) {
    src = `https://player.vimeo.com/video/${m[1]}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&dnt=1`;
  }
  return (
    <div className="video-bg">
      {src && <iframe src={src} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen frameBorder="0" />}
      <div className="video-tint" />
      {grain && <div className="video-grain" />}
    </div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-eyebrow">Jenny Yu &nbsp;·&nbsp; Studio</div>
        <h1 className="hero-name">I am <em>Jenny Yu</em></h1>
        <p className="hero-line">Art is the only language I've found that needs no translation.</p>
      </div>
      <div className="scroll-hint">
        <span>scroll, slowly</span>
        <span className="line"></span>
      </div>
    </header>
  );
}

function Divider({ mark }) {
  return <div className="divider"><span>{mark}</span></div>;
}

function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="section-inner">
        <div className="eyebrow reveal">A beginning</div>
        <h2 className="section-title reveal delay-1">About — <em>in my own voice</em></h2>
        <div className="prose reveal delay-2">
          <p>I was born between worlds, literally at 37,000 feet, and I have spent my life translating: between cultures, between languages, between those who have everything and those who have nothing.</p>
          <p>Art is the only language I've found that needs no translation. It gave me clarity when I was fifteen, newly arrived in New York, and feeling invisible in a country that hadn't made room for me yet. It became not just something I loved, but the lens through which I understand the world — and my responsibility to it.</p>
          <span className="lift">"I paint abstractions that feel like dreams, because dreams are where the subconscious speaks most honestly."</span>
          <p>That responsibility shapes everything I do. I founded TLN, the 100 Hidden Dreams Project, to build a community where privilege becomes consciousness rather than harm. I run a foundation that puts art in the hands of underserved young people — not as a luxury, but as a tool for navigating life.</p>
          <p>I don't want to be remembered. I want the work to outlast me — carried forward by the people whose lives it touched.</p>
          <span className="signature">— Jenny</span>
        </div>
      </div>
    </section>
  );
}

function CollectionSection() {
  const pieces = [
    {
      title: "Untitled — Fragments",
      year: "2024",
      size: "48 × 36 in",
      medium: "Oil on Linen",
      img: "face.jpg",
      n: "01",
      body: [
        "A figure emerging from the dark — fragments of light catching at the edges of the seen. The face arrives without warning, as memories sometimes do.",
        "I painted this in long, quiet hours. The shards around the figure are pieces of color I refused to let resolve, because the truth of the moment was that nothing did resolve.",
      ],
      status: "Available",
      feature: true,
    },
    {
      title: "幽玄",
      romaji: "Yūgen",
      year: "2020–2024",
      size: "46 × 46 in (116 × 116 cm)",
      medium: "Oil and Acrylics on Linen",
      img: "yugen.jpg",
      n: "02",
      body: [
        "YŪGEN 幽玄 speaks to an elusive, intangible authenticity of beauty—one that cannot be fully seen or defined, but quietly felt within an object or moment. It is a presence rather than a form.",
        "I began this painting in 2020, during the stillness of the pandemic, carrying a sense of unease and disappointment within myself. When I returned to it a year later, something had shifted. Where there was once heaviness, I began to notice light.",
        "Yūgen, to me, is the understanding that beauty lives in ambiguity—in imperfection, in the unseen, and in the space where imagination completes what reality cannot.",
      ],
      status: "Available",
    },
    {
      title: "A Quiet Between Worlds",
      year: "2026",
      size: "36 × 46 in (91 × 116 cm)",
      medium: "Oil and Acrylics on Linen",
      img: "quiet-between-worlds.jpg",
      n: "03",
      body: [
        "I am drawn to the moments that do not fully belong anywhere—the in-between states where something is neither arriving nor leaving. This painting lives in that quiet threshold. It feels like a place, but also like a memory of a place, dissolving as you try to hold onto it.",
        "The glowing forms suggest presence, yet they never fully materialize. Light emerges from within the darkness, but instead of revealing, it softens and obscures.",
        "I began this piece with dark mixed purple on canvas, allowing the pigments to blend and resist each other organically. I was interested in how colors could create depth without defining form.",
      ],
      status: "Available",
    },
  ];
  return (
    <section id="collection" className="section">
      <div className="section-inner section-wide">
        <div className="eyebrow reveal">A glimpse, not a gallery</div>
        <h2 className="section-title reveal delay-1">Collection — <em>three to begin</em></h2>
        <p className="prose reveal delay-2" style={{maxWidth: '640px'}}>
          Three works to enter through. Oil and mixed media. Each painting is a held breath — atmospheric, layered, refusing to resolve. Private viewings and art consulting by invitation only — DM on Instagram welcome. The full archive sits a click away.
        </p>
        <div className="works-list">
          {pieces.map((p, i) => (
            <article key={i} className={`work reveal ${i % 2 === 1 ? 'work-flip' : ''}`}>
              <figure className="work-figure">
                <img src={p.img} alt={p.title} loading="lazy" />
              </figure>
              <div className="work-text">
                <div className="work-n">{p.n}</div>
                <h3 className="work-title">
                  {p.title}
                  {p.romaji && <span className="work-romaji">{p.romaji}</span>}
                </h3>
                <div className="work-body">
                  {p.body.map((par, j) => <p key={j}>{par}</p>)}
                </div>
                <dl className="work-meta">
                  <div><dt>Medium</dt><dd>{p.medium}</dd></div>
                  <div><dt>Year</dt><dd>{p.year}</dd></div>
                  <div><dt>Dimensions</dt><dd>{p.size}</dd></div>
                  <div><dt>Status</dt><dd>{p.status}</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>
        <div className="works-more reveal">
          <a className="btn btn-ghost" href="gallery.html">
            View the full gallery →
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const exhibitions = [
    { year: "2026", title: "Solo Presentation",        venue: "Meng's Gallery · Noho, New York",        note: "Forthcoming" },
    { year: "2024", title: "Huangpu River Solo Show",  venue: "By invitation · Shanghai, China",        note: "Solo" },
    { year: "2023", title: "Chelsea Solo Show",        venue: "Chelsea Arts District · New York",       note: "Solo" },
  ];
  const privateEvents = [
    { year: "2026", title: "Williamsburg Penthouse Viewing", venue: "Private collectors · Brooklyn, NY",      note: "By invitation" },
    { year: "2025", title: "United Nations Yacht Auction",   venue: "Conference benefit · New York Harbor",   note: "Charity · Closed" },
    { year: "2025", title: "The Hamptons Auction",           venue: "Private patrons · East Hampton, NY",     note: "Acquired", href: "https://gamma.app/docs/Summer-2025-Hamptons-Silent-Auction-xulq7ywk4p6pz12" },
  ];

  const Row = ({ it, i }) => {
    const inner = (
      <>
        <div className="project-year">{it.year}</div>
        <div>
          <div className="project-title">{it.title}</div>
          <div className="project-venue">{it.venue}</div>
        </div>
        <div className="project-note">{it.note}</div>
        <div className="project-arrow">→</div>
      </>
    );
    return it.href ? (
      <li key={i} className="project-row project-row-link">
        <a className="project-row-anchor" href={it.href} target="_blank" rel="noopener">{inner}</a>
      </li>
    ) : (
      <li key={i} className="project-row">{inner}</li>
    );
  };

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="eyebrow reveal">Selected history</div>
        <h2 className="section-title reveal delay-1">Exhibitions &amp; <em>private engagements</em></h2>
        <p className="prose reveal delay-2">
          A quiet record of where the work has lived — across galleries, foundations, and the private rooms of
          collectors who have chosen to live with it. Most placements arrive through introduction.
        </p>

        <div className="projects-category reveal delay-3">
          <div className="projects-category-head">
            <span className="projects-category-mark">I.</span>
            <span className="projects-category-label">Shows &amp; Exhibitions</span>
            <span className="projects-category-rule" />
          </div>
          <ul className="projects-list">
            {exhibitions.map((it, i) => <Row it={it} i={i} key={i} />)}
          </ul>
        </div>

        <div className="projects-category reveal delay-4">
          <div className="projects-category-head">
            <span className="projects-category-mark">II.</span>
            <span className="projects-category-label">Private Events &amp; Acquisitions</span>
            <span className="projects-category-rule" />
          </div>
          <ul className="projects-list">
            {privateEvents.map((it, i) => <Row it={it} i={i} key={i} />)}
          </ul>
        </div>

        <p className="projects-footnote reveal delay-5">
          Private viewings, charitable placements, and museum loans are arranged by appointment.
          Inquiries through <a href="#contact">the studio</a>.
        </p>
      </div>
    </section>
  );
}

function CommissionSection() {
  const steps = [
    { n: "01", label: "The Letter",  img: "commission-letter.jpg",   duration: "Week 1",  text: "You write. I read carefully. We schedule a call to talk about the room, the feeling, and what you'd like to live with." },
    { n: "02", label: "The Vision",  img: "commission-vision.jpg",   duration: "Week 1–2", text: "Two or three small studies in pencil and pigment. We choose a direction together — palette, scale, mood — before any paint touches the linen." },
    { n: "03", label: "The Work",    img: "commission-work.jpg",     duration: "Week 2–4", text: "I paint. Progress is shared sparingly — the surface needs privacy to find itself. You'll see one or two studio updates along the way." },
    { n: "04", label: "The Arrival", img: "commission-arrival.jpg",  duration: "Week 4–5", text: "Final approval, varnish, and signing. Hand-delivered when possible, packaged with care, installed with you." },
  ];
  const sizes = [
    { label: "Intimate", size: '18 × 24"',  price: "$2,400+",  note: "For a quiet corner, a hallway, a bedside." },
    { label: "Domestic", size: '36 × 36"',  price: "$5,800+",  note: "Living rooms, dining rooms, mid-scale walls." },
    { label: "Statement", size: '46 × 46"', price: "$8,400+",  note: "A focal point. Anchors a room." },
    { label: "Architectural", size: '60"+ ', price: "By inquiry", note: "Hospitality, lobbies, hotels, large residential." },
  ];
  return (
    <section id="commission" className="section">
      <div className="section-inner">
        <div className="eyebrow reveal">For a specific room</div>
        <h2 className="section-title reveal delay-1">Commission — <em>made for you</em></h2>
        <div className="prose reveal delay-2">
          <p>I take on a small number of commissions each year — for private collectors, hotels, and spaces that want art made for the way they're actually used.</p>
          <p>From first letter to final delivery, the process takes <strong style={{color:'#c79bd6'}}>three to five weeks</strong>, depending on scale and shipping. Each piece is one of one — yours, made for the way light falls in your room.</p>
        </div>

        <div className="commission-steps">
          {steps.map((s, i) => (
            <article key={i} className={`cstep reveal ${i % 2 === 1 ? 'cstep-flip' : ''}`}>
              <figure className="cstep-img"><img src={s.img} alt={s.label} loading="lazy" /></figure>
              <div className="cstep-text">
                <div className="cstep-n">{s.n} · {s.duration}</div>
                <h3 className="cstep-label">{s.label}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="csize-block reveal">
          <div className="csize-eyebrow">Sizing &amp; investment</div>
          <div className="csize-title">Four scales to choose from</div>
          <div className="csize-grid">
            {sizes.map((s, i) => (
              <div key={i} className="csize-card">
                <div className="csize-label">{s.label}</div>
                <div className="csize-size">{s.size}</div>
                <div className="csize-price">{s.price}</div>
                <div className="csize-note">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="csize-foot">
            All commissions include sketches, varnish, and signed certificate of authenticity. Domestic shipping included; international by quote. A 50% deposit secures your slot.
          </div>
        </div>

        <CommissionForm />
      </div>
    </section>
  );
}

function CommissionForm() {
  return (
    <form className="letter reveal" onSubmit={(e) => { e.preventDefault(); alert('Letter sent. Thank you.'); }}>
      <div className="letter-eyebrow">Begin with a letter</div>
      <div className="letter-title">Tell me about the room, the light, the feeling you want to walk into.</div>
      <div className="form-row">
        <input className="field" placeholder="Your name" />
        <input className="field" placeholder="Email" type="email" />
      </div>
      <div className="form-row single">
        <input className="field" placeholder="The room, the city" />
      </div>
      <textarea className="field field-area" rows="6" placeholder="A few sentences is enough."></textarea>
      <div className="form-foot">
        <button className="btn" type="submit">Send letter</button>
        <span className="form-foot-note">Replies come slowly, but they come.</span>
      </div>
    </form>
  );
}

function OpenCallSection() {
  const counter = { painted: 67, total: 100, raised: "$184,000", recipients: 67 };
  return (
    <section id="open-call" className="section">
      <div className="section-inner">
        <div className="eyebrow reveal">An open call</div>
        <h2 className="section-title reveal delay-1">The 100 <em>Hidden Dreams</em></h2>
        <div className="prose reveal delay-2">
          <p>TLN's 100 Hidden Dreams is a philanthropic project I started in 2023. I am painting one hundred small works, each one made in response to a real, anonymous dream submitted by a stranger.</p>
          <span className="lift">"Every painting is given away, free, to someone who needs it."</span>
          <p>Every dollar raised through partnerships goes to mental health organizations supporting women and immigrants — the people whose dreams are most often kept quiet.</p>
          <p>If you have a dream you've never told anyone, you can tell me. If you have a foundation, a brand, or a gallery that wants to walk this with us, we are looking for partners for the next hundred.</p>
        </div>
        <div className="dreams-counter reveal delay-3">
          <div>
            <div className="counter-num">{counter.painted}<span className="counter-of">/{counter.total}</span></div>
            <div className="counter-label">painted</div>
          </div>
          <div>
            <div className="counter-num">{counter.raised}</div>
            <div className="counter-label">raised &amp; given</div>
          </div>
          <div>
            <div className="counter-num">{counter.recipients}</div>
            <div className="counter-label">strangers, with a painting</div>
          </div>
        </div>
        <div className="dreams-grid reveal">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className={`dream-cell ${i < counter.painted ? 'filled' : ''}`} title={i < counter.painted ? `Dream #${i+1} — painted` : `Dream #${i+1} — open`} />
          ))}
        </div>
        <div className="dreams-cta reveal">
          <a className="btn" href="#contact">Submit a dream</a>
          <a className="btn btn-ghost" href="#contact">Become a partner</a>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const channels = [
    { label: "Studios",    value: "New York, USA  ·  Shanghai, China" },
    { label: "Email",      value: "Jennyprivategallery@gmail.com",  href: "mailto:Jennyprivategallery@gmail.com" },
    { label: "Gallery",    value: "Jenny Yu Private Gallery" },
    { label: "Web",        value: "jennyprivategallery.com",        href: "https://jennyprivategallery.com" },
    { label: "Instagram",  value: "@jennyfinearts",                 href: "https://instagram.com/jennyfinearts" },
    { label: "Engagements", value: "Private viewings & art consulting — by invitation only. DM on Instagram welcome." },
  ];
  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="eyebrow reveal">Inquiries &amp; representation</div>
        <h2 className="section-title reveal delay-1">Jenny <em>Yu</em></h2>
        <p className="prose reveal delay-2">
          For collectors, institutions, and considered partnerships. Acquisitions, commissions, and private viewings are arranged directly through the studio. Correspondence is read personally; replies arrive thoughtfully.
        </p>
        <ul className="channels reveal delay-3">
          {channels.map((c, i) => (
            <li key={i} className="channel-row">
              <div className="channel-label">{c.label}</div>
              <div className="channel-value">
                {c.href ? <a href={c.href}>{c.value}</a> : c.value}
              </div>
            </li>
          ))}
        </ul>
        <form className="letter reveal" onSubmit={(e) => { e.preventDefault(); alert('Sent. Thank you.'); }}>
          <div className="letter-eyebrow">Or write directly</div>
          <div className="form-row">
            <input className="field" placeholder="Your name" />
            <input className="field" placeholder="Email" type="email" />
          </div>
          <div className="form-row single">
            <select className="field" defaultValue="">
              <option value="" disabled>I am writing about…</option>
              <option>An acquisition</option>
              <option>A private commission</option>
              <option>A private viewing</option>
              <option>An exhibition or institution</option>
              <option>The 100 Hidden Dreams</option>
              <option>Press</option>
              <option>Something else</option>
            </select>
          </div>
          <textarea className="field field-area" rows="5" placeholder="A few sentences is enough."></textarea>
          <div className="form-foot">
            <button className="btn" type="submit">Send</button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-mark">— a quiet place to stay inside.</div>
      <div className="foot-line">
        <span>© Jenny Yu Private Gallery</span>
        <a href="mailto:Jennyprivategallery@gmail.com">Jennyprivategallery@gmail.com</a>
        <a href="https://instagram.com/jennyfinearts" target="_blank" rel="noopener">@jennyfinearts</a>
        <span>New York · Shanghai</span>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
