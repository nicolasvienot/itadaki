CREATE TABLE IF NOT EXISTS destinations (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  country           TEXT NOT NULL,
  cover_photo_url   TEXT NOT NULL,
  short_description TEXT NOT NULL,
  display_order     INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dishes (
  id             TEXT PRIMARY KEY,
  destination_id TEXT NOT NULL REFERENCES destinations(id),
  name           TEXT NOT NULL,
  local_name     TEXT NOT NULL,
  photo_url      TEXT NOT NULL,
  one_liner      TEXT NOT NULL,
  fun_fact       TEXT,
  display_order  INT  NOT NULL DEFAULT 0
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read dishes"        ON dishes        FOR SELECT USING (true);

GRANT SELECT ON public.destinations TO anon, authenticated;
GRANT SELECT ON public.dishes       TO anon, authenticated;

-- ───────────────────────────── Seed data ──────────────────────────────

INSERT INTO destinations (id, name, country, cover_photo_url, short_description, display_order) VALUES
  ('lisbon',   'Lisbon',   'Portugal', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80&auto=format&fit=crop', 'Sunlit hills, Atlantic coast, and a cuisine built on salt cod and custard.',                                              0),
  ('osaka',    'Osaka',    'Japan',    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80&auto=format&fit=crop', 'Japan''s kitchen — the city that invented "kuidaore", eating until you drop.',                                           1),
  ('montreal', 'Montreal', 'Canada',   'https://images.unsplash.com/photo-1519178251-5390a0fb6a3f?w=800&q=80&auto=format&fit=crop', 'Where French soul meets North American excess — the most delicious identity crisis on the continent.',                   2);

INSERT INTO dishes (id, destination_id, name, local_name, photo_url, one_liner, fun_fact, display_order) VALUES
  -- Lisbon
  ('lisbon_pasteis_de_nata', 'lisbon', 'Custard Tart',         'Pastel de Nata',         'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop', 'Scorched custard in a flaky shell, best warm from the oven.',                                             'The original recipe is kept secret by monks at the Jerónimos Monastery since 1837.',                               0),
  ('lisbon_bacalhau',        'lisbon', 'Salt Cod & Eggs',      'Bacalhau à Brás',        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop', 'Flaked dried cod scrambled with eggs and matchstick potato crisps.',                                     'Portugal has over 365 ways to cook bacalhau — one for every day of the year.',                                    1),
  ('lisbon_frango',          'lisbon', 'Piri-Piri Chicken',    'Frango Piri-Piri',       'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80&auto=format&fit=crop', 'Flame-grilled with a fiery, garlicky sauce from Africa via Portugal.',                                    NULL,                                                                                                              2),
  ('lisbon_bifanas',         'lisbon', 'Pork Sandwich',        'Bifanas',                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop', 'Thin pork slices in a crusty roll doused in sauce — Lisbon''s fast food.',                               NULL,                                                                                                              3),
  ('lisbon_caldo_verde',     'lisbon', 'Green Broth',          'Caldo Verde',            'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop', 'Silky potato soup ribboned with dark kale and a coin of chorizo.',                                           NULL,                                                                                                              4),
  ('lisbon_percebes',        'lisbon', 'Barnacles',            'Percebes',               'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop', 'Strange, briny, and unmistakably Atlantic — a hand-harvested luxury.',                                    'Percebes grow on wave-battered rocks and must be harvested by hand at great risk.',                               5),
  ('lisbon_ginjinha',        'lisbon', 'Sour Cherry Liqueur',  'Ginjinha',               'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop', 'A shot of deep-red cherry liqueur served in a tiny chocolate cup.',                                         NULL,                                                                                                              6),
  ('lisbon_sardinhas',       'lisbon', 'Grilled Sardines',     'Sardinhas Assadas',      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop', 'Grilled whole, salted, eaten with your hands at the June street festivals.',                              NULL,                                                                                                              7),
  ('lisbon_ovos_moles',      'lisbon', 'Egg Sweets',           'Ovos Moles',             'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80&auto=format&fit=crop', 'Baroque egg-yolk confections shaped as sea creatures — convent-made since the 1600s.',                   NULL,                                                                                                              8),

  -- Osaka
  ('osaka_takoyaki',         'osaka', 'Octopus Balls',         'たこ焼き (Takoyaki)',     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop', 'Molten batter balls stuffed with octopus, topped with dancing bonito flakes.',                          'Osaka has more takoyaki stalls than any other city — locals eat them as a snack, not a meal.',                    0),
  ('osaka_okonomiyaki',      'osaka', 'Savory Pancake',        'お好み焼き (Okonomiyaki)', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop', 'Thick pancake with cabbage, pork, and seafood — Osaka style, griddled at the table.',                  '"Okonomi" means "what you like" — you build your own.',                                                           1),
  ('osaka_kushikatsu',       'osaka', 'Deep-Fried Skewers',    '串カツ (Kushikatsu)',     'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&auto=format&fit=crop', 'Breaded and fried skewers of meat and vegetables — never double-dip the shared sauce.',                 'The no-double-dip rule is sacred. Violating it at a traditional joint will get you scolded.',                     2),
  ('osaka_kitsune_udon',     'osaka', 'Fox Udon',              'きつねうどん (Kitsune Udon)', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop', 'Thick udon noodles in light dashi broth topped with sweet fried tofu.',                            'Kitsune udon was invented in Osaka in the 1800s. "Kitsune" means fox — the tofu resembles fox ears in folklore.', 3),
  ('osaka_negiyaki',         'osaka', 'Green Onion Pancake',   'ねぎ焼き (Negiyaki)',     'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop', 'Thinner, sharper cousin of okonomiyaki — all green onion, beef tendon, and dashi.',                        NULL,                                                                                                              4),
  ('osaka_doteyaki',         'osaka', 'Miso Beef Tendon',      'どて焼き (Doteyaki)',     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop', 'Beef tendon slow-simmered in sweet miso and sake until fork-tender.',                                   NULL,                                                                                                              5),
  ('osaka_ikayaki',          'osaka', 'Grilled Squid',         'いかやき (Ikayaki)',      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80&auto=format&fit=crop', 'Whole squid griddled with soy sauce — the definitive Dotonbori street snack.',                         NULL,                                                                                                              6),
  ('osaka_ramen',            'osaka', 'Osaka Ramen',           'ラーメン',               'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop', 'Lighter than Tokyo-style — clean soy or salt broth, chewy noodles, charred chashu.',                        NULL,                                                                                                              7),
  ('osaka_matcha_parfait',   'osaka', 'Matcha Parfait',        '抹茶パフェ (Matcha Parfaito)', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop', 'Towering layers of bitter matcha ice cream, mochi, red bean, and cornflakes.',               'Parfaits in Japan are an art form — some require reservations months in advance.',                                 8),

  -- Montreal
  ('montreal_poutine',       'montreal', 'Poutine',               'Poutine',               'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop', 'Fries, fresh cheese curds, and hot gravy — Quebec''s gift to the world.',                             'The squeaky cheese curds are the mark of freshness. If they don''t squeak, it''s not authentic poutine.',         0),
  ('montreal_smoked_meat',   'montreal', 'Smoked Meat Sandwich',  'Sandwich de viande fumée', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80&auto=format&fit=crop', 'Thick-cut brisket cured for 10 days, steamed, piled high on rye with yellow mustard.',          'Schwartz''s Deli has been serving the same recipe since 1928. The line outside hasn''t changed either.',          1),
  ('montreal_bagel',         'montreal', 'Montreal Bagel',         'Bagel montréalais',      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop', 'Smaller, sweeter, denser than New York — boiled in honey water and baked in a wood-fired oven.',       'The Montreal bagel has a larger hole and is always baked in a wood-fired oven. New Yorkers are wrong.',           2),
  ('montreal_tourtiere',     'montreal', 'Meat Pie',               'Tourtière',              'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop', 'Spiced pork and veal pie baked in a buttery crust — Quebec''s holiday centrepiece.',              'Every family has its own recipe, kept secret across generations. The spice blend is never shared.',               3),
  ('montreal_beavertail',    'montreal', 'BeaverTail',             'Queue de castor',        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop', 'Fried whole-wheat dough stretched flat, topped with cinnamon sugar or Nutella.',                   'Obama ate one in Ottawa in 2009 and caused a Canadian national moment.',                                          4),
  ('montreal_steamie',       'montreal', 'Steamed Hot Dog',        'Steamé',                 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop', 'A soft steamed bun, a steamed dog, coleslaw on top — the working-class icon of the dépanneur.', NULL,                                                                                                              5),
  ('montreal_crepes',        'montreal', 'Buckwheat Crêpe',        'Crêpe de sarrasin',      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&auto=format&fit=crop', 'Thin, earthy buckwheat crêpe with ham, egg, and aged cheddar — Quebec''s version of a galette.', NULL,                                                                                                              6),
  ('montreal_maple_taffy',   'montreal', 'Maple Taffy',            'Tire d''érable',         'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop', 'Hot maple syrup poured on packed snow, then rolled onto a stick as it sets into chewy candy.',    'Only made during sugaring-off season (March–April). Eating it any other time of year is considered cheating.',    7),
  ('montreal_cretons',       'montreal', 'Pork Spread',            'Cretons',                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop', 'Silky spiced pork spread served cold on toast — the Québécois answer to rillettes.',                  'A staple of the traditional Quebec breakfast, served alongside eggs and toast since the 1800s.',                  8);
