

import { DJ, Business, Gig, Track, Playlist, Role, Tier, User, FeedItem, Notification, NotificationType, Chat, Message, EnrichedChat, Listener, StreamSession } from '../types';

// --- DATA POPULATION ---

const userList: { id: string; name: string; email: string; role: Role; }[] = [
  // DJs (200) - Curated for Cape Town Based Deep House, Techno, Minimal (Excluding Gqom/Amapiano & non-CPT)
  { id: 'dj-1', name: 'K-DOLLA', email: 'k-dolla@test.com', role: Role.DJ },
  { id: 'dj-2', name: 'FKA Mash', email: 'fka@test.com', role: Role.DJ },
  { id: 'dj-3', name: 'Desiree', email: 'desiree@test.com', role: Role.DJ },
  { id: 'dj-4', name: 'Sides', email: 'sides@test.com', role: Role.DJ },
  { id: 'dj-5', name: 'DJ Loyd', email: 'loyd@test.com', role: Role.DJ },
  { id: 'dj-6', name: 'Paradise Citizens', email: 'paradise@test.com', role: Role.DJ },
  { id: 'dj-7', name: 'The Fogshow', email: 'fogshow@test.com', role: Role.DJ },
  { id: 'dj-8', name: 'Vinny Da Vinci', email: 'vinny@test.com', role: Role.DJ },
  { id: 'dj-9', name: 'Lawrence Dix', email: 'lawrence@test.com', role: Role.DJ },
  { id: 'dj-10', name: 'Dwson', email: 'dwson@test.com', role: Role.DJ },
  { id: 'dj-11', name: 'Pierre Johnson', email: 'pierre@test.com', role: Role.DJ },
  { id: 'dj-12', name: 'Leighton Moody', email: 'leighton@test.com', role: Role.DJ },
  { id: 'dj-13', name: 'Jullian Gomes', email: 'jullian@test.com', role: Role.DJ },
  { id: 'dj-14', name: 'Kat La Kat', email: 'kat@test.com', role: Role.DJ },
  { id: 'dj-15', name: 'Sir Vincent', email: 'vincent@test.com', role: Role.DJ },
  { id: 'dj-16', name: 'K-Faith', email: 'kfaith@test.com', role: Role.DJ },
  { id: 'dj-17', name: 'Ryan Hill', email: 'ryanhill@test.com', role: Role.DJ },
  { id: 'dj-18', name: 'The Lazarusman', email: 'lazarusman@test.com', role: Role.DJ },
  { id: 'dj-19', 'name': 'Atmos Blaq', 'email': 'atmos@test.com', 'role': Role.DJ },
  { id: 'dj-20', 'name': 'Kid Fonque', 'email': 'kidfonque@test.com', 'role': Role.DJ },
  { id: 'dj-21', 'name': 'Jazzuelle', 'email': 'jazzuelle@test.com', 'role': Role.DJ },
  { id: 'dj-22', 'name': 'Gina Jeanz', 'email': 'gina@test.com', 'role': Role.DJ },
  { id: 'dj-23', 'name': 'Thibo Tazz', 'email': 'thibo@test.com', 'role': Role.DJ },
  { id: 'dj-24', 'name': 'Ryan Murgatroyd', 'email': 'ryan@test.com', 'role': Role.DJ },
  { id: 'dj-25', 'name': 'Kostakis', 'email': 'kostakis@test.com', 'role': Role.DJ },
  { id: 'dj-26', 'name': 'Enoo Napa', 'email': 'enoo@test.com', 'role': Role.DJ },
  { id: 'dj-27', 'name': 'Lemon & Herb', 'email': 'lemonherb@test.com', 'role': Role.DJ },
  { id: 'dj-29', 'name': 'Culoe De Song', 'email': 'culoe@test.com', 'role': Role.DJ },
  { id: 'dj-30', 'name': 'Sobantwana', 'email': 'sobantwana@test.com', 'role': Role.DJ },
  { id: 'dj-31', 'name': 'DJ Buhle', 'email': 'buhle@test.com', 'role': Role.DJ },
  { id: 'dj-32', 'name': 'Caiiro', 'email': 'caiiro@test.com', 'role': Role.DJ },
  { id: 'dj-33', 'name': 'Chronical Deep', 'email': 'chronical@test.com', 'role': Role.DJ },
  { id: 'dj-34', 'name': 'SGVO', 'email': 'sgvo@test.com', 'role': Role.DJ },
  { id: 'dj-35', 'name': 'Deep Aztec', 'email': 'aztec@test.com', 'role': Role.DJ },
  { id: 'dj-36', 'name': 'Bantwanas', 'email': 'bantwanas@test.com', 'role': Role.DJ },
  { id: 'dj-38', 'name': 'Audiojerk', 'email': 'audiojerk@test.com', 'role': Role.DJ },
  { id: 'dj-39', name: 'Ivan Turanjanin', email: 'ivan@test.com', role: Role.DJ },
  { id: 'dj-40', name: 'Dylan Munro', email: 'dylan@test.com', role: Role.DJ },
  { id: 'dj-41', name: 'KHORD', email: 'khord@test.com', role: Role.DJ },
  { id: 'dj-42', name: 'Native Sound', email: 'native@test.com', role: Role.DJ },
  { id: 'dj-43', name: 'Irshaad Samaai', email: 'irshaad@test.com', role: Role.DJ },
  { id: 'dj-44', name: 'Rose Bonica', email: 'rose@test.com', role: Role.DJ },
  { id: 'dj-45', name: 'Dean FUEL', email: 'dean@test.com', role: Role.DJ },
  { id: 'dj-46', name: 'Double X eL', email: 'doublex@test.com', role: Role.DJ },
  { id: 'dj-47', name: 'Amy Mauritz', email: 'amymauritz@test.com', role: Role.DJ },
  { id: 'dj-48', name: 'Bones', email: 'bones@test.com', role: Role.DJ },
  { id: 'dj-49', name: 'W.N.N.E', email: 'wnne@test.com', role: Role.DJ },
  { id: 'dj-50', name: 'Josh.DLM', email: 'joshdlm@test.com', role: Role.DJ },
  { id: 'dj-51', name: 'Echoic', email: 'echoic@test.com', role: Role.DJ },
  { id: 'dj-52', name: 'Subterranean', email: 'subterranean@test.com', role: Role.DJ },
  { id: 'dj-53', name: 'Lady M', email: 'ladym@test.com', role: Role.DJ },
  { id: 'dj-54', name: 'Dr. Dub', email: 'drdub@test.com', role: Role.DJ },
  { id: 'dj-55', name: 'Static Flow', email: 'staticflow@test.com', role: Role.DJ },
  { id: 'dj-56', name: 'Rhythmic Theory', email: 'rhythmictheory@test.com', role: Role.DJ },
  { id: 'dj-57', name: 'Kaelin Anderson', email: 'kaelin@test.com', role: Role.DJ },
  { id: 'dj-58', name: 'Terra Blake', email: 'terra@test.com', role: Role.DJ },
  { id: 'dj-59', name: 'Aeron X', email: 'aeron@test.com', role: Role.DJ },
  { id: 'dj-60', name: 'B-Side', email: 'bside@test.com', role: Role.DJ },
  { id: 'dj-61', name: 'Ciro Leone', email: 'ciro@test.com', role: Role.DJ },
  { id: 'dj-62', name: 'Dantiez', email: 'dantiez@test.com', role: Role.DJ },
  { id: 'dj-63', name: 'Elias Fassos', email: 'elias@test.com', role: Role.DJ },
  { id: 'dj-64', name: 'Fabio & Grooverider', email: 'fabio@test.com', role: Role.DJ },
  { id: 'dj-65', name: 'Gareth Stephens', email: 'gareth@test.com', role: Role.DJ },
  { id: 'dj-66', name: 'Haelo', email: 'haelo@test.com', role: Role.DJ },
  { id: 'dj-67', name: 'Ikenna Sound', email: 'ikenna@test.com', role: Role.DJ },
  { id: 'dj-68', name: 'Jonas Rathsman', email: 'jonas@test.com', role: Role.DJ },
  { id: 'dj-69', name: 'Kian V', email: 'kian@test.com', role: Role.DJ },
  { id: 'dj-70', name: 'Liam Mandiaro', email: 'liam@test.com', role: Role.DJ },
  { id: 'dj-71', name: 'Mika Francis', email: 'mika@test.com', role: Role.DJ },
  { id: 'dj-72', name: 'Nico Stojan', email: 'nico@test.com', role: Role.DJ },
  { id: 'dj-73', name: 'Oscar Mbo', email: 'oscar@test.com', role: Role.DJ },
  { id: 'dj-74', name: 'Paolo Rocco', email: 'paolo@test.com', role: Role.DJ },
  { id: 'dj-75', name: 'Quinton Harris', email: 'quinn@test.com', role: Role.DJ },
  { id: 'dj-76', name: 'Rhys Phillips', email: 'rhys@test.com', role: Role.DJ },
  { id: 'dj-77', name: 'Sasha Marie', email: 'sasha@test.com', role: Role.DJ },
  { id: 'dj-78', name: 'Teo Moss', email: 'teo@test.com', role: Role.DJ },
  { id: 'dj-79', name: 'Ugo Boss', email: 'ugo@test.com', role: Role.DJ },
  { id: 'dj-80', name: 'Vince Watson', email: 'vince@test.com', role: Role.DJ },
  { id: 'dj-81', name: 'Wyatt Marshall', email: 'wyatt@test.com', role: Role.DJ },
  { id: 'dj-82', name: 'Xavi', email: 'xavi@test.com', role: Role.DJ },
  { id: 'dj-83', name: 'Yara', email: 'yara@test.com', role: Role.DJ },
  { id: 'dj-84', name: 'Zane Gulston', email: 'zane@test.com', role: Role.DJ },
  { id: 'dj-85', name: 'Asher Hale', email: 'asher@test.com', role: Role.DJ },
  { id: 'dj-86', name: 'Bodhi Kai', email: 'bodhi@test.com', role: Role.DJ },
  { id: 'dj-87', name: 'Cruz Lafont', email: 'cruz@test.com', role: Role.DJ },
  { id: 'dj-88', name: 'Dane Stirrat', email: 'dane@test.com', role: Role.DJ },
  { id: 'dj-89', name: 'Ezra', email: 'ezra@test.com', role: Role.DJ },
  { id: 'dj-90', name: 'Finn', email: 'finn@test.com', role: Role.DJ },
  { id: 'dj-91', name: 'Grey Area', email: 'grey@test.com', role: Role.DJ },
  { id: 'dj-92', name: 'Hayes', email: 'hayes@test.com', role: Role.DJ },
  { id: 'dj-93', name: 'Idris', email: 'idris@test.com', role: Role.DJ },
  { id: 'dj-94', name: 'Jude', email: 'jude@test.com', role: Role.DJ },
  { id: 'dj-95', name: 'Kane', email: 'kane@test.com', role: Role.DJ },
  { id: 'dj-96', name: 'Leon', email: 'leon@test.com', role: Role.DJ },
  { id: 'dj-97', name: 'Milo', email: 'milo@test.com', role: Role.DJ },
  { id: 'dj-98', name: 'Noel', email: 'noel@test.com', role: Role.DJ },
  { id: 'dj-99', name: 'Orion', email: 'orion@test.com', role: Role.DJ },
  { id: 'dj-100', name: 'Paco', email: 'paco@test.com', role: Role.DJ },
  { id: 'dj-101', name: 'Reid', email: 'reid@test.com', role: Role.DJ },
  { id: 'dj-102', name: 'Seth', email: 'seth@test.com', role: Role.DJ },
  { id: 'dj-103', name: 'Troy', email: 'troy@test.com', role: Role.DJ },
  { id: 'dj-104', name: 'Vaughn', email: 'vaughn@test.com', role: Role.DJ },
  { id: 'dj-105', name: 'West', email: 'west@test.com', role: Role.DJ },
  { id: 'dj-106', name: 'Zeke', email: 'zeke@test.com', role: Role.DJ },
  { id: 'dj-107', name: 'Aki', email: 'aki@test.com', role: Role.DJ },
  { id: 'dj-108', name: 'Brio', email: 'brio@test.com', role: Role.DJ },
  { id: 'dj-109', name: 'Cade', email: 'cade@test.com', role: Role.DJ },
  { id: 'dj-110', name: 'Dell', email: 'dell@test.com', role: Role.DJ },
  { id: 'dj-111', name: 'Erin', email: 'erin@test.com', role: Role.DJ },
  { id: 'dj-112', name: 'Faye', email: 'faye@test.com', role: Role.DJ },
  { id: 'dj-113', name: 'Gia', email: 'gia@test.com', role: Role.DJ },
  { id: 'dj-114', name: 'Hope', email: 'hope@test.com', role: Role.DJ },
  { id: 'dj-115', name: 'Isla', email: 'isla@test.com', role: Role.DJ },
  { id: 'dj-116', name: 'Jade', email: 'jade@test.com', role: Role.DJ },
  { id: 'dj-117', name: 'Kira', email: 'kira@test.com', role: Role.DJ },
  { id: 'dj-118', name: 'Lana', email: 'lana@test.com', role: Role.DJ },
  { id: 'dj-119', name: 'Maeve', email: 'maeve@test.com', role: Role.DJ },
  { id: 'dj-120', name: 'Nia', email: 'nia@test.com', role: Role.DJ },
  { id: 'dj-121', name: 'Orla', email: 'orla@test.com', role: Role.DJ },
  { id: 'dj-122', name: 'Piper', email: 'piper@test.com', role: Role.DJ },
  { id: 'dj-123', name: 'Rae', email: 'rae@test.com', role: Role.DJ },
  { id: 'dj-124', name: 'Skye', email: 'skye@test.com', role: Role.DJ },
  { id: 'dj-125', name: 'Tess', email: 'tess@test.com', role: Role.DJ },
  { id: 'dj-126', name: 'Veda', email: 'veda@test.com', role: Role.DJ },
  { id: 'dj-127', name: 'Wren', email: 'wren@test.com', role: Role.DJ },
  { id: 'dj-128', name: 'Zara', email: 'zara@test.com', role: Role.DJ },
  { id: 'dj-129', name: 'Axel', email: 'axel@test.com', role: Role.DJ },
  { id: 'dj-130', name: 'Blaze', email: 'blaze@test.com', role: Role.DJ },
  { id: 'dj-131', name: 'Cortex', email: 'cortex@test.com', role: Role.DJ },
  { id: 'dj-132', name: 'Drift', email: 'drift@test.com', role: Role.DJ },
  { id: 'dj-133', name: 'Flux', email: 'flux@test.com', role: Role.DJ },
  { id: 'dj-134', name: 'Glitch', email: 'glitch@test.com', role: Role.DJ },
  { id: 'dj-135', name: 'Hex', email: 'hex@test.com', role: Role.DJ },
  { id: 'dj-136', name: 'Jinx', email: 'jinx@test.com', role: Role.DJ },
  { id: 'dj-137', name: 'Kore', email: 'kore@test.com', role: Role.DJ },
  { id: 'dj-138', name: 'Ludo', email: 'ludo@test.com', role: Role.DJ },
  { id: 'dj-139', name: 'Morph', email: 'morph@test.com', role: Role.DJ },
  { id: 'dj-140', name: 'Nyx', email: 'nyx@test.com', role: Role.DJ },
  { id: 'dj-141', name: 'Omen', email: 'omen@test.com', role: Role.DJ },
  { id: 'dj-142', name: 'Plex', email: 'plex@test.com', role: Role.DJ },
  { id: 'dj-143', name: 'Quest', email: 'quest@test.com', role: Role.DJ },
  { id: 'dj-144', name: 'Rift', email: 'rift@test.com', role: Role.DJ },
  { id: 'dj-145', name: 'Shard', email: 'shard@test.com', role: Role.DJ },
  { id: 'dj-146', name: 'Triton', email: 'triton@test.com', role: Role.DJ },
  { id: 'dj-147', name: 'Vex', email: 'vex@test.com', role: Role.DJ },
  { id: 'dj-148', name: 'Wraith', email: 'wraith@test.com', role: Role.DJ },
  { id: 'dj-149', name: 'Zephyr', email: 'zephyr@test.com', role: Role.DJ },
  { id: 'dj-150', name: 'Apex', email: 'apex@test.com', role: Role.DJ },
  { id: 'dj-151', name: 'Binary', email: 'binary@test.com', role: Role.DJ },
  { id: 'dj-152', name: 'Cygnus', email: 'cygnus@test.com', role: Role.DJ },
  { id: 'dj-153', name: 'Duality', email: 'duality@test.com', role: Role.DJ },
  { id: 'dj-154', name: 'Eon', email: 'eon@test.com', role: Role.DJ },
  { id: 'dj-155', name: 'Fathom', email: 'fathom@test.com', role: Role.DJ },
  { id: 'dj-156', name: 'Grid', email: 'grid@test.com', role: Role.DJ },
  { id: 'dj-157', name: 'Halo', email: 'halo@test.com', role: Role.DJ },
  { id: 'dj-158', name: 'Ion', email: 'ion@test.com', role: Role.DJ },
  { id: 'dj-159', name: 'Jett', email: 'jett@test.com', role: Role.DJ },
  { id: 'dj-160', name: 'Kilo', email: 'kilo@test.com', role: Role.DJ },
  { id: 'dj-161', name: 'Lumen', email: 'lumen@test.com', role: Role.DJ },
  { id: 'dj-162', name: 'Matrix', email: 'matrix@test.com', role: Role.DJ },
  { id: 'dj-163', name: 'Nexus', email: 'nexus@test.com', role: Role.DJ },
  { id: 'dj-164', name: 'Orbit', email: 'orbit@test.com', role: Role.DJ },
  { id: 'dj-165', name: 'Pulse', email: 'pulse@test.com', role: Role.DJ },
  { id: 'dj-166', name: 'Quasar', email: 'quasar@test.com', role: Role.DJ },
  { id: 'dj-167', name: 'Rune', email: 'rune@test.com', role: Role.DJ },
  { id: 'dj-168', name: 'Solis', email: 'solis@test.com', role: Role.DJ },
  { id: 'dj-169', name: 'Torus', email: 'torus@test.com', role: Role.DJ },
  { id: 'dj-170', name: 'Unit 731', email: 'unit@test.com', role: Role.DJ },
  { id: 'dj-171', name: 'Void', email: 'void@test.com', role: Role.DJ },
  { id: 'dj-172', name: 'Waveform', email: 'wave@test.com', role: Role.DJ },
  { id: 'dj-173', name: 'Xenon', email: 'xenon@test.com', role: Role.DJ },
  { id: 'dj-174', name: 'Yotta', email: 'yotta@test.com', role: Role.DJ },
  { id: 'dj-175', name: 'Zeta', email: 'zeta@test.com', role: Role.DJ },
  { id: 'dj-176', name: 'Aura', email: 'aura@test.com', role: Role.DJ },
  { id: 'dj-177', name: 'Blend', email: 'blend@test.com', role: Role.DJ },
  { id: 'dj-178', name: 'Craft', email: 'craft@test.com', role: Role.DJ },
  { id: 'dj-179', name: 'Dade', email: 'dade@test.com', role: Role.DJ },
  { id: 'dj-180', name: 'Elara', email: 'elara@test.com', role: Role.DJ },
  { id: 'dj-181', name: 'Fenix', email: 'fenix@test.com', role: Role.DJ },
  { id: 'dj-182', name: 'Grail', email: 'grail@test.com', role: Role.DJ },
  { id: 'dj-183', name: 'Haze', email: 'haze@test.com', role: Role.DJ },
  { id: 'dj-184', name: 'Indi', email: 'indi@test.com', role: Role.DJ },
  { id: 'dj-185', name: 'Jaxx', email: 'jaxx@test.com', role: Role.DJ },
  { id: 'dj-186', name: 'Kyro', email: 'kyro@test.com', role: Role.DJ },
  { id: 'dj-187', name: 'Luxe', email: 'luxe@test.com', role: Role.DJ },
  { id: 'dj-188', name: 'Moss', email: 'moss@test.com', role: Role.DJ },
  { id: 'dj-189', name: 'Nate', email: 'nate@test.com', role: Role.DJ },
  { id: 'dj-190', name: 'Onyx', email: 'onyx@test.com', role: Role.DJ },
  { id: 'dj-191', name: 'Pax', email: 'pax@test.com', role: Role.DJ },
  { id: 'dj-192', name: 'Ren', email: 'ren@test.com', role: Role.DJ },
  { id: 'dj-193', 'name': 'Silas', 'email': 'silas@test.com', 'role': Role.DJ },
  { id: 'dj-194', 'name': 'Tale Of Us', 'email': 'tale@test.com', 'role': Role.DJ },
  { id: 'dj-195', 'name': 'Vale', 'email': 'vale@test.com', 'role': Role.DJ },
  { id: 'dj-196', 'name': 'Zeal', 'email': 'zeal@test.com', 'role': Role.DJ },
  { id: 'dj-197', 'name': 'Kern', 'email': 'kern@test.com', 'role': Role.DJ },
  { id: 'dj-198', 'name': 'Silo', 'email': 'silo@test.com', 'role': Role.DJ },
  { id: 'dj-199', 'name': 'Monad', 'email': 'monad@test.com', 'role': Role.DJ },
  { id: 'dj-200', 'name': 'LastID', 'email': 'lastid@test.com', 'role': Role.DJ },


  // Businesses (200) - Curated for relevant venues & event brands
  { id: 'biz-1', name: 'Mødular.', email: 'modular@test.com', role: Role.Business },
  { id: 'biz-2', name: 'The Waiting Room', email: 'waitingroom@test.com', role: Role.Business },
  { id: 'biz-3', name: 'We House Sundays', email: 'whs@test.com', role: Role.Business },
  { id: 'biz-4', name: 'District', email: 'district@test.com', role: Role.Business },
  { id: 'biz-5', name: 'ERA', email: 'era@test.com', role: Role.Business },
  { id: 'biz-6', name: 'The House of Machines', email: 'machines@test.com', role: Role.Business },
  { id: 'biz-7', name: 'Souk', email: 'souk@test.com', role: Role.Business },
  { id: 'biz-8', name: 'Reset', email: 'reset@test.com', role: Role.Business },
  { id: 'biz-9', name: 'Colorbox Studios', email: 'colorbox@test.com', role: Role.Business },
  { id: 'biz-10', name: 'Fiction', email: 'fiction@test.com', role: Role.Business },
  { id: 'biz-11', name: 'The Armchair Theatre', email: 'armchair@test.com', role: Role.Business },
  { id: 'biz-12', name: 'SurfaRosa', email: 'surfarosa@test.com', role: Role.Business },
  { id: 'biz-13', name: 'The Athletic Club & Social', email: 'athletic@test.com', role: Role.Business },
  { id: 'biz-14', name: 'Safehouse', email: 'safehouse@test.com', role: Role.Business },
  { id: 'biz-15', name: 'Club Paradise', email: 'paradise@test.com', role: Role.Business },
  { id: 'biz-16', name: 'Castle of Good Hope', email: 'castle@test.com', role: Role.Business },
  { id: 'biz-17', name: 'GrandWest Casino', email: 'grandwest@test.com', role: Role.Business },
  { id: 'biz-18', name: 'A Touch of Madness', email: 'madness@test.com', role: Role.Business },
  { id: 'biz-19', name: 'Pressure', email: 'pressure@test.com', role: Role.Business },
  { id: 'biz-20', name: 'Tokyo Traphouse', email: 'tokyo@test.com', role: Role.Business },
  { id: 'biz-21', 'name': 'Retreat.', 'email': 'retreat@test.com', 'role': Role.Business },
  { id: 'biz-22', 'name': 'Kinky Disco', 'email': 'kinky@test.com', 'role': Role.Business },
  { id: 'biz-23', 'name': 'Wolfkop Weekender', 'email': 'wolfkop@test.com', 'role': Role.Business },
  { id: 'biz-24', 'name': 'Love All', 'email': 'loveall@test.com', 'role': Role.Business },
  { id: 'biz-25', 'name': 'Secrets of Summer', 'email': 'secrets@test.com', 'role': Role.Business },
  { id: 'biz-26', 'name': 'It Is What It Is', 'email': 'iiwii@test.com', 'role': Role.Business },
  { id: 'biz-27', 'name': 'The Other Side', 'email': 'otherside@test.com', 'role': Role.Business },
  { id: 'biz-28', 'name': 'Alive', 'email': 'alive@test.com', 'role': Role.Business },
  { id: 'biz-29', 'name': 'HER', 'email': 'her@test.com', 'role': Role.Business },
  { id: 'biz-30', 'name': 'Chinchilla', 'email': 'chinchilla@test.com', 'role': Role.Business },
  { id: 'biz-31', 'name': 'Cabo Beach Club', 'email': 'cabo@test.com', 'role': Role.Business },
  { id: 'biz-32', 'name': 'The Movemint', 'email': 'movemint@test.com', 'role': Role.Business },
  { id: 'biz-33', 'name': 'Kulture', 'email': 'kulture@test.com', 'role': Role.Business },
  { id: 'biz-34', 'name': 'Wonderland', 'email': 'wonderland@test.com', 'role': Role.Business },
  { id: 'biz-35', 'name': 'The Ostrich', 'email': 'ostrich@test.com', 'role': Role.Business },
  { id: 'biz-36', 'name': 'Hello Stranger', 'email': 'hellostranger@test.com', 'role': Role.Business },
  { id: 'biz-37', 'name': 'Blame It On The Disco', 'email': 'disco@test.com', 'role': Role.Business },
  { id: 'biz-38', 'name': 'Sexy Groovy Love', 'email': 'sgl@test.com', 'role': Role.Business },
  { id: 'biz-39', 'name': 'One Productions', 'email': 'one@test.com', 'role': Role.Business },
  { id: 'biz-40', 'name': 'Cause & Effect', 'email': 'cause@test.com', 'role': Role.Business },
  { id: 'biz-41', 'name': 'The Search', 'email': 'search@test.com', 'role': Role.Business },
  { id: 'biz-42', name: 'Stay True Sounds', email: 'staytrue@test.com', role: Role.Business },
  { id: 'biz-43', name: 'Bridges for Music', email: 'bridges@test.com', role: Role.Business },
  { id: 'biz-44', name: 'PULSE', email: 'pulse@test.com', role: Role.Business },
  { id: 'biz-45', name: 'Cape Town Electronic Music Festival', email: 'ctemf@test.com', role: Role.Business },
  { id: 'biz-46', name: 'The German Club', email: 'germanclub@test.com', role: Role.Business },
  { id: 'biz-47', name: 'The Golden Hour', email: 'goldenhour@test.com', role: Role.Business },
  { id: 'biz-48', name: 'Living Room Jozi (CPT Pop-up)', email: 'livingroom@test.com', role: Role.Business },
  { id: 'biz-49', name: 'Deep End', email: 'deepend@test.com', role: Role.Business },
  { id: 'biz-50', name: 'UNTMD', email: 'untmd@test.com', role: Role.Business },
  // 150 more businesses
  { id: 'biz-51', name: 'Origin Festival', email: 'origin@test.com', role: Role.Business },
  { id: 'biz-52', name: 'Vortex Parallel Universe', email: 'vortex@test.com', role: Role.Business },
  { id: 'biz-53', name: 'Earthdance Cape Town', email: 'earthdance@test.com', role: Role.Business },
  { id: 'biz-54', name: 'Bazique Festival', email: 'bazique@test.com', role: Role.Business },
  { id: 'biz-55', name: 'Lighthouse Festival', email: 'lighthouse@test.com', role: Role.Business },
  { id: 'biz-56', name: 'Science Frikshun', email: 'sciencefrikshun@test.com', role: Role.Business },
  { id: 'biz-57', name: 'Toybox', email: 'toybox@test.com', role: Role.Business },
  { id: 'biz-58', name: 'Diskotekah', email: 'diskotekah@test.com', role: Role.Business },
  { id: 'biz-59', name: 'Into The Wild', email: 'intothewild@test.com', role: Role.Business },
  { id: 'biz-60', name: 'The Loft', email: 'theloft@test.com', role: Role.Business },
  { id: 'biz-61', name: 'And', email: 'and@test.com', role: Role.Business },
  { id: 'biz-62', name: 'The Endless Daze', email: 'endlessdaze@test.com', role: Role.Business },
  { id: 'biz-63', name: 'Smalltown Beat', email: 'smalltown@test.com', role: Role.Business },
  { id: 'biz-64', name: 'Good Hope Centre', email: 'ghc@test.com', role: Role.Business },
  { id: 'biz-65', name: 'The Assembly', email: 'assembly@test.com', role: Role.Business },
  { id: 'biz-66', name: 'Mercury Live', email: 'mercury@test.com', role: Role.Business },
  { id: 'biz-67', name: 'Zsa Zsa', email: 'zsazsa@test.com', role: Role.Business },
  { id: 'biz-68', name: 'Arcade', email: 'arcade@test.com', role: Role.Business },
  { id: 'biz-69', name: 'Perseverance Tavern', email: 'perseverance@test.com', role: Role.Business },
  { id: 'biz-70', name: 'Harringtons Cocktail Lounge', email: 'harringtons@test.com', role: Role.Business },
  { id: 'biz-71', name: 'Love Thy Neighbour', email: 'lovethyneighbour@test.com', role: Role.Business },
  { id: 'biz-72', name: 'The Jagger Lounge', email: 'jagger@test.com', role: Role.Business },
  { id: 'biz-73', name: 'Truth Collective', email: 'truth@test.com', role: Role.Business },
  { id: 'biz-74', name: 'Reboot', email: 'reboot@test.com', role: Role.Business },
  { id: 'biz-75', name: 'Teknotribe', email: 'teknotribe@test.com', role: Role.Business },
  { id: 'biz-76', name: 'The Rooftop', email: 'therooftop@test.com', role: Role.Business },
  { id: 'biz-77', name: 'Sunset Sweatshop', email: 'sunsetsweatshop@test.com', role: Role.Business },
  { id: 'biz-78', name: 'The Grand Cafe & Beach', email: 'grandbeach@test.com', role: Role.Business },
  { id: 'biz-79', name: 'Shimmy Beach Club', email: 'shimmy@test.com', role: Role.Business },
  { id: 'biz-80', name: 'HQ Restaurant', email: 'hq@test.com', role: Role.Business },
  { id: 'biz-201', name: 'Neon Nights Club', email: 'neon@test.com', role: Role.Business },
  { id: 'biz-202', name: 'Skyline Rooftop', email: 'skyline@test.com', role: Role.Business },
  { id: 'biz-203', name: 'The Bassment', email: 'bassment@test.com', role: Role.Business },
  { id: 'biz-204', name: 'Groove Garden', email: 'groovegarden@test.com', role: Role.Business },
  ...Array.from({ length: 116 }, (_, i) => ({
    id: `biz-${81 + i}`,
    name: `Venue ${81 + i}`,
    email: `venue${81 + i}@test.com`,
    role: Role.Business
  })),

  // Listeners (50+)
  { id: 'listener-1', name: 'Cape Town Raver', email: 'listener@test.com', role: Role.Listener },
  { id: 'listener-2', name: 'Techno Tannie', email: 'tannie@test.com', role: Role.Listener },
  { id: 'listener-3', name: 'DeepHouseDave', email: 'dave@test.com', role: Role.Listener },
  { id: 'listener-4', 'name': 'Minimalist Mike', 'email': 'mike@test.com', 'role': Role.Listener },
  { id: 'listener-5', 'name': 'Festive Fiona', 'email': 'fiona@test.com', 'role': Role.Listener },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `listener-${6 + i}`,
    name: `MusicLover${6 + i}`,
    email: `listener${6 + i}@test.com`,
    role: Role.Listener
  })),
];

const djAvatars: Record<string, string> = {
  'dj-1': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', // K-DOLLA
  'dj-2': 'https://images.unsplash.com/photo-1621282662052-163351a84b23?q=80&w=800&auto=format&fit=crop', // FKA Mash
  'dj-3': 'https://images.unsplash.com/photo-1594623930335-9491a343a429?q=80&w=800&auto=format&fit=crop', // Desiree
  'dj-4': 'https://images.unsplash.com/photo-1542628635-43a968949826?q=80&w=800&auto=format&fit=crop', // Sides
  'dj-5': 'https://images.unsplash.com/photo-1619472579549-3c873ael22b2?q=80&w=800&auto=format&fit=crop', // DJ Loyd
  'dj-6': 'https://images.unsplash.com/photo-1520870122482-7cc13f185f83?q=80&w=800&auto=format&fit=crop', // Paradise Citizens
  'dj-7': 'https://images.unsplash.com/photo-1616298829923-264379e43657?q=80&w=800&auto=format&fit=crop', // The Fogshow
  'dj-8': 'https://images.unsplash.com/photo-1608615349429-2c6369527f7f?q=80&w=800&auto=format&fit=crop', // Vinny Da Vinci
  'dj-9': 'https://images.unsplash.com/photo-1575822648834-7589088194a2?q=80&w=800&auto=format&fit=crop', // Lawrence Dix
  'dj-10': 'https://images.unsplash.com/photo-1558656255-442475651c6c?q=80&w=800&auto=format&fit=crop', // Dwson
  'dj-11': 'https://images.unsplash.com/photo-1582236340244-a74b0c519a8f?q=80&w=800&auto=format&fit=crop', // Pierre Johnson
  'dj-12': 'https://images.unsplash.com/photo-1516223337229-923e42841364?q=80&w=800&auto=format&fit=crop', // Leighton Moody
  'dj-13': 'https://images.unsplash.com/photo-1581353108502-9907b539b56f?q=80&w=800&auto=format&fit=crop', // Jullian Gomes
  'dj-14': 'https://images.unsplash.com/photo-1519690740683-3669b9e59d57?q=80&w=800&auto=format&fit=crop', // Kat La Kat
  'dj-15': 'https://images.unsplash.com/photo-1534349762237-7227e7f3541e?q=80&w=800&auto=format&fit=crop', // Sir Vincent
  'dj-24': 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop', // Ryan Murgatroyd
  'dj-26': 'https://images.unsplash.com/photo-1505248203168-38379342ca2d?q=80&w=800&auto=format&fit=crop', // Enoo Napa
  'dj-29': 'https://images.unsplash.com/photo-1563200085-c16de8676936?q=80&w=800&auto=format&fit=crop', // Culoe De Song
  'dj-39': 'https://images.unsplash.com/photo-1587329314902-142834b6b158?q=80&w=800&auto=format&fit=crop', // Ivan Turanjanin
  'dj-44': 'https://images.unsplash.com/photo-1598289431512-b970a5971716?q=80&w=800&auto=format&fit=crop', // Rose Bonica
  'dj-45': 'https://images.unsplash.com/photo-1567011319082-6281b3737b6a?q=80&w=800&auto=format&fit=crop', // Dean FUEL
  'dj-194': 'https://images.unsplash.com/photo-1509372448373-c35b6a445694?q=80&w=800&auto=format&fit=crop', // Tale Of Us
};

const venueAvatars: Record<string, string> = {
  'biz-1': 'https://images.unsplash.com/photo-1587329314902-142834b6b158?q=80&w=800&auto=format&fit=crop', // Mødular
  'biz-2': 'https://images.unsplash.com/photo-1549449336-720f78a2e6a1?q=80&w=800&auto=format&fit=crop', // The Waiting Room
  'biz-3': 'https://images.unsplash.com/photo-1578736641334-6294a5595f56?q=80&w=800&auto=format&fit=crop', // We House Sundays
  'biz-4': 'https://images.unsplash.com/photo-1563814039345-4581caf83f7a?q=80&w=800&auto=format&fit=crop', // District
  'biz-5': 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=800&auto=format&fit=crop', // ERA
  'biz-23': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop', // Wolfkop Weekender
  'biz-38': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', // Sexy Groovy Love
  'biz-43': 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=800&auto=format&fit=crop', // Bridges for Music
  'biz-44': 'https://images.unsplash.com/photo-1618397769533-cb6f6a9ce725?q=80&w=800&auto=format&fit=crop', // PULSE
  'biz-45': 'https://images.unsplash.com/photo-1561489401-fc217c649dc7?q=80&w=800&auto=format&fit=crop', // CTEMF
  'biz-51': 'https://images.unsplash.com/photo-1627429188421-3e5454625b64?q=80&w=800&auto=format&fit=crop', // Origin Festival
  'biz-54': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop',  // Bazique Festival
  'biz-201': 'https://images.unsplash.com/photo-1556912173-3c662c938c82?q=80&w=800&auto=format&fit=crop', // Neon Nights Club
  'biz-202': 'https://images.unsplash.com/photo-1582642250450-498a835b6f6f?q=80&w=800&auto=format&fit=crop', // Skyline Rooftop
  'biz-203': 'https://images.unsplash.com/photo-1516970039352-25ec6e02de8b?q=80&w=800&auto=format&fit=crop', // The Bassment
  'biz-204': 'https://images.unsplash.com/photo-1517457373958-b7bdd4e87205?q=80&w=800&auto=format&fit=crop', // Groove Garden
};

const users: User[] = userList.map((u) => {
  let avatarUrl = `https://picsum.photos/seed/${u.id}/200`; // Default
  if (u.role === Role.DJ && djAvatars[u.id]) {
    avatarUrl = djAvatars[u.id];
  } else if (u.role === Role.Business && venueAvatars[u.id]) {
    avatarUrl = venueAvatars[u.id];
  }
  return { ...u, avatarUrl, settings: { theme: 'electric_blue' } };
});


// --- TRACKS & PLAYLISTS ---
const tracks: Track[] = [
  { id: 't1', title: 'Midnight Groove', artistId: 'dj-1', artworkUrl: 'https://picsum.photos/seed/t1/200', duration: '4:12' },
  { id: 't2', title: 'Soweto Blues', artistId: 'dj-2', artworkUrl: 'https://picsum.photos/seed/t2/200', duration: '6:30' },
  { id: 't3', title: 'Femme', artistId: 'dj-3', artworkUrl: 'https://picsum.photos/seed/t3/200', duration: '5:55' },
  { id: 't4', title: 'Observatory', artistId: 'dj-4', artworkUrl: 'https://picsum.photos/seed/t4/200', duration: '7:01' },
  { id: 't5', 'title': 'Impulse', 'artistId': 'dj-10', 'artworkUrl': 'https://picsum.photos/seed/t5/200', 'duration': '6:45' },
  { id: 't6', 'title': 'Stay True', 'artistId': 'dj-13', 'artworkUrl': 'https://picsum.photos/seed/t6/200', 'duration': '7:10' },
  { id: 't7', 'title': 'The Calling', 'artistId': 'dj-7', 'artworkUrl': 'https://picsum.photos/seed/t7/200', 'duration': '6:30' },
  { id: 't8', 'title': 'Webaba', 'artistId': 'dj-29', 'artworkUrl': 'https://picsum.photos/seed/t8/200', 'duration': '8:05' },
  { id: 't9', 'title': 'Obscure', 'artistId': 'dj-33', 'artworkUrl': 'https://picsum.photos/seed/t9/200', 'duration': '7:20' },
  { id: 't10', 'title': 'Raw Logic', 'artistId': 'dj-44', 'artworkUrl': 'https://picsum.photos/seed/t10/200', 'duration': '5:50' },
];

const playlists: Playlist[] = [
  { id: 'pl1', name: 'Deep Tech Cape Town', creatorId: 'dj-1', trackIds: ['t1', 't5'], artworkUrl: 'https://picsum.photos/seed/pl1/200' },
  { id: 'pl2', name: 'Afro House Sunset', creatorId: 'dj-2', trackIds: ['t2', 't6', 't8'], artworkUrl: 'https://picsum.photos/seed/pl2/200' },
  { id: 'pl3', name: 'Modular Moments', creatorId: 'dj-39', trackIds: [], artworkUrl: 'https://picsum.photos/seed/pl3/200' },
  { id: 'pl4', name: 'Dub Echoes Vol. 5', creatorId: 'dj-4', trackIds: ['t4', 't1', 't5'], artworkUrl: 'https://picsum.photos/seed/pl4/200' },
];

// --- DETAILED PROFILES ---
let djs: DJ[] = (users.filter(u => u.role === Role.DJ) as User[]).map((user, index) => {
    const specificDjs = [
        { id: 'dj-1', location: 'City Bowl, Cape Town', genres: ['Deep House', 'Techno'], bio: 'Pushing the boundaries of electronic music from the heart of Cape Town. Known for deep, melodic journeys.', rating: 4.98, reviewsCount: 154, followers: 12500, tier: Tier.NeonLegend, following: ['dj-2', 'dj-3', 'biz-1', 'biz-3'] },
        { id: 'dj-2', location: 'Camps Bay, Cape Town', genres: ['Afro House', 'Soulful House'], bio: 'Curating sonic experiences that blend traditional African rhythms with modern electronic beats.', rating: 4.95, reviewsCount: 120, followers: 8500, tier: Tier.GoldGroove, following: ['dj-1', 'dj-8'] },
        { id: 'dj-3', location: 'Observatory, Cape Town', genres: ['Techno', 'Minimal'], bio: 'A rising star in the underground scene, delivering powerful and hypnotic techno sets.', rating: 4.92, reviewsCount: 65, followers: 9800, tier: Tier.GoldGroove, following: ['dj-1', 'dj-7', 'dj-10'] },
        { id: 'dj-4', location: 'Woodstock, Cape Town', genres: ['Dub-Techno', 'Deep House'], bio: 'Specializing in deep, atmospheric dub techno. All about the space between the notes.', rating: 4.85, reviewsCount: 45, followers: 2500, tier: Tier.Silver, following: ['dj-9', 'dj-10'] },
        { id: 'dj-6', location: 'Sea Point, Cape Town', genres: ['Melodic House', 'Progressive House'], bio: 'A duo known for their euphoric and uplifting melodic house sets, perfect for sunsets.', rating: 4.9, reviewsCount: 78, followers: 6000, tier: Tier.GoldGroove, following: ['dj-24'] },
        { id: 'dj-7', location: 'Green Point, Cape Town', genres: ['Deep-Tech', 'Minimal'], bio: 'Head of The Other Side events, The Fogshow crafts intricate and groovy minimal soundscapes.', rating: 4.91, reviewsCount: 92, followers: 7500, tier: Tier.GoldGroove, following: ['dj-3', 'dj-9'] },
        { id: 'dj-9', location: 'Tamboerskloof, Cape Town', genres: ['Minimal', 'House'], bio: 'A vinyl purist, Lawrence Dix brings a raw, authentic energy to his funky minimal house sets.', rating: 4.88, reviewsCount: 60, followers: 4200, tier: Tier.Silver, following: ['dj-4', 'dj-7'] },
        { id: 'dj-10', location: 'Woodstock, Cape Town', genres: ['Deep House', 'Lo-fi House'], bio: 'Deep, atmospheric, and emotionally charged house music.', rating: 4.89, reviewsCount: 95, followers: 15000, tier: Tier.GoldGroove, following: ['dj-11', 'dj-12'] },
        { id: 'dj-39', location: 'City Bowl, Cape Town', genres: ['Techno', 'Progressive'], bio: 'The driving force behind Mødular and a stalwart of the Cape Town techno scene.', rating: 4.96, reviewsCount: 200, followers: 18000, tier: Tier.NeonLegend, following: ['dj-1', 'dj-3'] },
        { id: 'dj-44', location: 'Salt River, Cape Town', genres: ['Techno', 'Industrial', 'EBM'], bio: 'Uncompromising, raw, and experimental. Pushing the harder edges of techno.', rating: 4.86, reviewsCount: 55, followers: 5500, tier: Tier.Silver, following: [] },
        { id: 'dj-46', location: 'Gardens, Cape Town', genres: ['Deep House', '90s House'], bio: 'selector. producer. @untitled.deep head honcho. bookings/promos: bookingsdoublex@gmail.com', rating: 4.9, reviewsCount: 88, followers: 7800, tier: Tier.GoldGroove, following: ['dj-5', 'dj-12'] },
    ];
    const specific = specificDjs.find(d => d.id === user.id);
    const genres = [
        ['Deep House', 'Minimal'], ['Afro Tech', 'House'], ['Dub-Techno', 'Deep House'],
        ['Soulful House', 'Lounge'], ['Deep-Tech', 'Techno'], ['Melodic House', 'Progressive'], ['Tech House'], ['Break-Dub', 'Minimal']
    ];
    const locations = ['City Bowl, Cape Town', 'Sea Point, Cape Town', 'Woodstock, Cape Town', 'Observatory, Cape Town', 'Claremont, Cape Town', 'Camps Bay, Cape Town'];

    return {
        ...user,
        role: Role.DJ,
        genres: specific?.genres || genres[index % genres.length],
        bio: specific?.bio || 'A passionate DJ making waves in the Cape Town music scene.',
        location: specific?.location || locations[index % locations.length],
        rating: specific?.rating || Number((4.9 - index * 0.015).toFixed(2)),
        reviewsCount: specific?.reviewsCount || (250 - index * 4),
        followers: specific?.followers || (20000 - index * 350),
        following: specific?.following || [],
        tier: specific?.tier || [Tier.GoldGroove, Tier.Silver, Tier.Bronze][index % 3],
        tracks: tracks.filter(t => t.artistId === user.id),
        mixes: playlists.filter(p => p.creatorId === user.id),
    };
});

let businesses: Business[] = (users.filter(u => u.role === Role.Business) as User[]).map((user, index) => {
    const specificVenues = [
        { id: 'biz-1', venueName: 'Mødular.', location: '34 Riebeek St, Cape Town', description: 'Cape Town\'s home for underground techno and house music. Dark, loud, and intimate.', rating: 4.9, reviewsCount: 255, followers: 22000, following: ['dj-1', 'dj-3', 'dj-10', 'dj-39'] },
        { id: 'biz-2', venueName: 'The Waiting Room', location: '273 Long St, Cape Town', description: 'Iconic rooftop bar and music venue with a diverse lineup of local and international talent.', rating: 4.7, reviewsCount: 430, followers: 18000, following: ['dj-5'] },
        { id: 'biz-3', venueName: 'We House Sundays', location: 'Event Series, Cape Town', description: 'A soulful house movement that celebrates music and togetherness through iconic Sunday gatherings.', rating: 4.95, reviewsCount: 180, followers: 35000, following: ['dj-2', 'dj-8'] },
        { id: 'biz-23', venueName: 'Wolfkop Weekender', location: 'Festival, Citrusdal', description: 'A boutique music festival experience set in nature, known for its curated electronic music.', rating: 4.98, reviewsCount: 300, followers: 45000, following: ['dj-11', 'dj-12'] },
        { id: 'biz-38', venueName: 'Sexy Groovy Love', location: 'Festival, The Cape Winelands', description: 'Lush, vibrant, and stylish boutique festivals in beautiful locations.', rating: 4.85, reviewsCount: 220, followers: 60000, following: ['dj-25'] },
        { id: 'biz-42', venueName: 'Stay True Sounds', location: 'Label / Event Series, Cape Town', description: 'One of South Africa\'s most respected deep house labels, curating showcases with their family of artists.', rating: 4.95, reviewsCount: 150, followers: 40000, following: ['dj-13', 'dj-20'] },
        { id: 'biz-43', venueName: 'Bridges for Music', location: 'Langa, Cape Town', description: 'A non-profit organization creating positive change in underserved communities through music.', rating: 4.99, reviewsCount: 100, followers: 25000, following: ['dj-11', 'dj-2'] },
        { id: 'biz-44', venueName: 'PULSE', location: 'Secret Warehouse, Cape Town', description: 'Hard-hitting, hypnotic techno events in unique industrial spaces.', rating: 4.87, reviewsCount: 80, followers: 8500, following: ['dj-39', 'dj-44'] },
        { id: 'biz-45', venueName: 'Cape Town Electronic Music Festival', location: 'Festival, Cape Town', description: 'The city\'s flagship electronic music festival, showcasing local and international talent.', rating: 4.91, reviewsCount: 500, followers: 85000, following: [] },
        { id: 'biz-49', venueName: 'Deep End', location: 'Event Series, Cape Town', description: 'For the heads. A recurring party focused on the deeper, dubbier side of techno and house.', rating: 4.88, reviewsCount: 70, followers: 6500, following: ['dj-4'] },
        { id: 'biz-50', venueName: 'UNTMD', location: 'Event Series, Cape Town', description: 'Raw, industrial, and experimental techno nights. No photos on the dancefloor.', rating: 4.85, reviewsCount: 65, followers: 7200, following: ['dj-44'] },
        { id: 'biz-51', venueName: 'Origin Festival', location: 'Festival, Elandskloof', description: 'Annual psychedelic music & arts festival in the mountains.', rating: 4.92, reviewsCount: 450, followers: 95000, following: [] },
        { id: 'biz-52', venueName: 'Vortex Parallel Universe', location: 'Festival, Riviersonderend', description: 'Legendary trance and electronic music festival with a rich history.', rating: 4.89, reviewsCount: 400, followers: 120000, following: [] },
        { id: 'biz-53', venueName: 'Earthdance Cape Town', location: 'Festival, Nekkies Resort', description: 'Part of a global music and peace festival, known for its conscious vibes.', rating: 4.85, reviewsCount: 320, followers: 65000, following: [] },
        { id: 'biz-54', venueName: 'Bazique Festival', location: 'Festival, Riviersonderend', description: 'A surreal wonderland of music, art, and absurdity.', rating: 4.9, reviewsCount: 280, followers: 75000, following: [] },
        { id: 'biz-201', venueName: 'Neon Nights Club', location: 'City Bowl, Cape Town', description: 'Underground club with a focus on neon aesthetics and driving techno.', rating: 4.8, reviewsCount: 112, followers: 9500, following: [] },
        { id: 'biz-202', venueName: 'Skyline Rooftop', location: 'De Waterkant, Cape Town', description: 'Chic rooftop bar with panoramic views, specializing in sunset house sessions.', rating: 4.7, reviewsCount: 180, followers: 12000, following: [] },
        { id: 'biz-203', venueName: 'The Bassment', location: 'CBD, Cape Town', description: 'No-frills basement club for serious music heads.', rating: 4.8, reviewsCount: 95, followers: 7500, following: [] },
        { id: 'biz-204', venueName: 'Groove Garden', location: 'Stellenbosch', description: 'Outdoor venue for day parties and festivals.', rating: 4.7, reviewsCount: 150, followers: 15000, following: [] },
    ];
    const specific = specificVenues.find(v => v.id === user.id);
    return {
        ...user,
        role: Role.Business,
        venueName: specific?.venueName || user.name,
        location: specific?.location || 'Cape Town, South Africa',
        description: specific?.description || 'A key player in the Cape Town music and events scene.',
        rating: specific?.rating || Number((4.8 - index * 0.02).toFixed(2)),
        reviewsCount: specific?.reviewsCount || (300 - index * 5),
        followers: specific?.followers || (15000 - index * 250),
        following: specific?.following || [],
    };
});

let listeners: Listener[] = (users.filter(u => u.role === Role.Listener) as User[]).map((user, index) => {
    // Let's make the listeners follow some key accounts
    const following = [];
    if(index % 3 === 0) following.push('dj-1', 'biz-1', 'dj-3'); // Techno fans
    if(index % 4 === 0) following.push('dj-2', 'biz-3', 'dj-8'); // House fans
    if(index % 5 === 0) following.push('dj-10', 'dj-11', 'biz-42'); // Deep house fans
    if(index === 0) following.push('dj-46', 'dj-39', 'biz-23', 'biz-54'); // The main raver follows a lot
    
    return {
        ...user,
        role: Role.Listener,
        following: [...new Set(following)], // Ensure unique follows
        followers: Math.floor(Math.random() * 50),
    };
});

// Update follower counts based on listener following data
listeners.forEach(listener => {
    listener.following.forEach(followedId => {
        const dj = djs.find(d => d.id === followedId);
        if (dj) dj.followers++;
        const biz = businesses.find(b => b.id === followedId);
        if (biz) biz.followers++;
    });
});


let allUsers = [...djs, ...businesses, ...listeners];


// --- GIGS ---
let gigs: Gig[] = [
  { id: 'g1', title: 'Deep Tech Invites: K-DOLLA', venueId: 'biz-1', date: '2025-08-15', time: '22:00', budget: 1500, description: 'Prepare for a journey into the deep. K-DOLLA takes over Mødular for a night of relentless techno.', genres: ['Techno', 'Deep-Tech'], status: 'Open' },
  { id: 'g2', title: 'Rooftop Grooves with DJ Loyd', venueId: 'biz-2', date: '2025-08-17', time: '19:00', budget: 800, description: 'Sunset vibes on the Long Street rooftop. Spinning soulful and deep house.', genres: ['Deep House', 'Soulful House'], status: 'Completed', bookedDjId: 'dj-5' },
  { id: 'g3', title: 'We House Sundays - August Edition', venueId: 'biz-3', date: '2025-08-18', time: '14:00', budget: 1200, description: 'Join the movement. Seeking a DJ who understands the soulful core of house music.', genres: ['Soulful House', 'Afro House'], status: 'Open'},
  { id: 'g4', title: 'Minimal Effort with The Fogshow', venueId: 'biz-4', date: '2025-08-22', time: '23:00', budget: 900, description: 'Intricate grooves and minimal soundscapes all night long with The Other Side head honcho.', genres: ['Minimal', 'Deep-Tech'], status: 'Booked', bookedDjId: 'dj-7'},
  { id: 'g5', title: 'ERA Re-opening Party', venueId: 'biz-5', date: '2025-09-01', time: '21:00', budget: 2000, description: 'The legend is back. We are looking for a headline techno act to celebrate our return.', genres: ['Techno'], status: 'Open'},
  { id: 'g6', title: 'Wolfkop Weekender - Main Stage', venueId: 'biz-23', date: '2026-01-28', time: '18:00', budget: 3500, description: 'Seeking artists for our annual journey into sound. Melodic and groovy sets preferred.', genres: ['Melodic House', 'Deep House', 'Techno'], status: 'Open'},
  { id: 'g7', title: 'Stay True Sounds Showcase', venueId: 'biz-42', date: '2025-09-15', time: '20:00', budget: 1800, description: 'A night dedicated to the finest deep house, with Kid Fonque at the helm.', genres: ['Deep House', 'Jazz'], status: 'Completed', bookedDjId: 'dj-20'},
  { id: 'g8', title: 'Minimal Effort with Pierre Johnson', venueId: 'biz-1', date: '2025-09-05', time: '23:00', budget: 1000, description: 'An intimate night of minimal and deep tech.', genres: ['Minimal', 'Deep-Tech'], status: 'Open'},
  { id: 'g9', title: 'Afro House Journey with Atmos Blaq', venueId: 'biz-7', date: '2025-09-06', time: '20:00', budget: 1200, description: 'An epic journey through the sounds of afro house and afro tech.', genres: ['Afro House', 'Afro Tech'], status: 'Open'},
  { id: 'g10', title: 'Dub Techno Special: Sides', venueId: 'biz-49', date: '2025-09-12', time: '22:00', budget: 750, description: 'Deep End presents a night of pure dub techno. Heads down, eyes closed.', genres: ['Dub-Techno', 'Deep House'], status: 'Open'},
  { id: 'g11', title: 'UNTMD Presents: Rose Bonica', venueId: 'biz-50', date: '2025-09-13', time: '23:00', budget: 900, description: 'Raw, industrial, and experimental techno all night long.', genres: ['Techno', 'Industrial'], status: 'Booked', bookedDjId: 'dj-44'},
  { id: 'g12', title: 'The Search: Leighton Moody All Night Long', venueId: 'biz-41', date: '2025-09-19', time: '21:00', budget: 1500, description: 'A masterclass in soulful and deep house from a Cape Town legend.', genres: ['Deep House', 'Soulful House'], status: 'Open'},
  { id: 'g13', title: 'Sexy Groovy Love - Spring Edition', venueId: 'biz-38', date: '2025-09-27', time: '12:00', budget: 2500, description: 'Our first party of the season! Looking for DJs that bring the vibe.', genres: ['House', 'Tech House', 'Deep House'], status: 'Open'},
  { id: 'g14', title: 'Fiction Fridays: Call for Residents', venueId: 'biz-10', date: '2025-10-01', time: '21:00', budget: 500, description: 'Fiction is looking for new resident DJs to join our family. Send us your mixes!', genres: ['Techno', 'House', 'Break-Dub'], status: 'Open'},
  { id: 'g15', title: 'It Is What It Is ft. Jullian Gomes', venueId: 'biz-26', date: '2025-09-28', time: '14:00', budget: 2000, description: 'The legendary Jullian Gomes graces the IIWII stage for a magical afternoon set.', genres: ['Deep House', 'Soulful House'], status: 'Booked', bookedDjId: 'dj-13'},

  // Gigs for dj-46 (Double X eL) to populate MyGigs page
  { id: 'g16', title: 'Neon Nights Club ft. Double X eL', venueId: 'biz-201', date: '2025-08-15', time: '9:00 PM - 2:00 AM', budget: 450, description: 'Bring extra speakers for outdoor area', genres: ['Techno', 'House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g17', title: 'Sunset Session', venueId: 'biz-202', date: '2025-08-18', time: '7:00 PM - 11:00 PM', budget: 320, description: 'Prepare a chill sunset vibe set', genres: ['Deep House', 'Melodic House'], status: 'Open' },
  { id: 'g18', title: 'Late Night Grooves', venueId: 'biz-1', date: '2025-08-29', time: '11:00 PM - 4:00 AM', budget: 500, description: 'Main room closing set', genres: ['Techno'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g19', title: 'Rooftop Day Party', venueId: 'biz-202', date: '2025-08-22', time: '2:00 PM - 8:00 PM', budget: 280, description: 'Day time event, play groovy house.', genres: ['House'], status: 'Open' },
  { id: 'g20', title: 'The Bassment Opening', venueId: 'biz-203', date: '2025-08-02', time: '10:00 PM - 3:00 AM', budget: 300, description: '', genres: ['Deep-Tech'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g21', title: 'Saturday Social', venueId: 'biz-6', date: '2025-08-09', time: '8:00 PM - 1:00 AM', budget: 250, description: 'Vibey, social atmosphere.', genres: ['House', 'Soulful House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g22', title: 'Groove Garden Festival', venueId: 'biz-204', date: '2025-08-16', time: '12:00 PM - 10:00 PM', budget: 400, description: 'Main stage, peak time slot.', genres: ['Melodic House', 'Progressive'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g23', title: 'We House Sundays Guest Slot', venueId: 'biz-3', date: '2025-08-24', time: '4:00 PM - 6:00 PM', budget: 350, description: 'Warm up for the headliner.', genres: ['Soulful House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g24', title: 'Fiction Wednesdays', venueId: 'biz-10', date: '2025-08-27', time: '10:00 PM - 1:00 AM', budget: 200, description: 'Mid-week party, anything goes.', genres: ['Breaks', 'House'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g25', title: 'Reset Closing Set', venueId: 'biz-8', date: '2025-08-30', time: '2:00 AM - 4:00 AM', budget: 250, description: '', genres: ['Techno'], status: 'Booked', bookedDjId: 'dj-46' },
  { id: 'g26', title: 'Warehouse Rave', venueId: 'biz-44', date: '2025-08-23', time: '11:00 PM - 4:00 AM', budget: 300, description: 'Hard and fast techno.', genres: ['Hard Techno', 'Industrial'], status: 'Open' },

  // Gigs for dj-46 to populate previous months on MyGigs page
  // July 2025
  { id: 'g27', title: 'Mid-Month Modular', venueId: 'biz-1', date: '2025-07-15', time: '10:00 PM - 3:00 AM', budget: 400, description: 'Past gig.', genres: ['Techno'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g28', title: 'Winter Warmer at Waiting Room', venueId: 'biz-2', date: '2025-07-22', time: '8:00 PM - 1:00 AM', budget: 250, description: 'Past gig.', genres: ['Deep House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g29', title: 'Souk Saturday', venueId: 'biz-7', date: '2025-07-12', time: '9:00 PM - 2:00 AM', budget: 300, description: 'Past gig.', genres: ['Melodic House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g30', title: 'Fiction Flashback', venueId: 'biz-10', date: '2025-07-04', time: '10:00 PM - 2:00 AM', budget: 200, description: 'Past gig.', genres: ['90s House'], status: 'Completed', bookedDjId: 'dj-46' },

  // June 2025
  { id: 'g31', title: 'Deep Tech Night', venueId: 'biz-203', date: '2025-06-20', time: '11:00 PM - 4:00 AM', budget: 350, description: 'Past gig.', genres: ['Deep-Tech'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g32', title: 'House of Machines Social', venueId: 'biz-6', date: '2025-06-13', time: '7:00 PM - 12:00 AM', budget: 200, description: 'Past gig.', genres: ['House', 'Soulful House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g33', title: 'Colorbox Showcase', venueId: 'biz-9', date: '2025-06-06', time: '9:00 PM - 2:00 AM', budget: 300, description: 'Past gig.', genres: ['Techno', 'Minimal'], status: 'Completed', bookedDjId: 'dj-46' },

  // May 2025
  { id: 'g34', title: 'ERA Special Guest', venueId: 'biz-5', date: '2025-05-30', time: '10:00 PM - 4:00 AM', budget: 500, description: 'Past gig.', genres: ['Progressive', 'Techno'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g35', title: 'Rooftop Sundowners', venueId: 'biz-202', date: '2025-05-16', time: '5:00 PM - 10:00 PM', budget: 320, description: 'Past gig.', genres: ['Melodic House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g36', title: 'Athletic Club Groove', venueId: 'biz-13', date: '2025-05-23', time: '8:00 PM - 1:00 AM', budget: 280, description: 'Past gig.', genres: ['Soulful House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g37', title: 'The Movemint', venueId: 'biz-32', date: '2025-05-09', time: '9:00 PM - 2:00 AM', budget: 250, description: 'Past gig.', genres: ['Deep House'], status: 'Completed', bookedDjId: 'dj-46' },
  { id: 'g38', title: 'Kulture Klub Night', venueId: 'biz-33', date: '2025-05-02', time: '10:00 PM - 3:00 AM', budget: 220, description: 'Past gig.', genres: ['Tech House'], status: 'Completed', bookedDjId: 'dj-46' },
];

let interests: { gigId: string; djId: string; timestamp: string }[] = [
    { gigId: 'g17', djId: 'dj-46', timestamp: new Date().toISOString() },
    { gigId: 'g19', djId: 'dj-46', timestamp: new Date().toISOString() },
    { gigId: 'g26', djId: 'dj-46', timestamp: new Date().toISOString() },
];

// --- STREAM SESSIONS ---
const streamSessions: StreamSession[] = [
    { id: 'stream-1', djId: 'dj-3', title: 'Live from a secret warehouse', isLive: true, listenerCount: 1342 },
];

// --- FEED ITEMS ---
let feedItems: FeedItem[] = [
    { id: 'f1', type: 'live_now', userId: 'dj-3', title: 'Desiree is LIVE from a secret warehouse.', description: 'Tuning in for some heavy techno vibes!', imageUrl: 'https://images.unsplash.com/photo-1594623930335-9491a343a429?q=80&w=800&auto=format&fit=crop', timestamp: '2h ago', likes: 1200, comments: 88, shares: 45, relatedId: 'stream-1' },
    { id: 'f2', type: 'new_track', userId: 'dj-10', title: 'New Track: City Lights', description: 'My new single "City Lights" is out now. A deep, lo-fi journey for late nights. Hope you enjoy.', imageUrl: 'https://picsum.photos/seed/dwson-track/600/400', timestamp: '18h ago', likes: 1800, comments: 130, shares: 77 },
    { id: 'f3', type: 'gig_announcement', userId: 'biz-3', title: 'We House Sundays - August Lineup!', description: 'So excited to announce FKA Mash will be headlining our next event! Tickets are flying.', imageUrl: 'https://picsum.photos/seed/whsaug/600/400', timestamp: '1d ago', likes: 950, comments: 45, shares: 30 },
    { id: 'f4', type: 'new_connection', userId: 'dj-1', title: 'K-DOLLA is now following Desiree', description: 'Two of the city\'s techno titans are now connected. We love to see it!', imageUrl: 'https://picsum.photos/seed/connect1/600/400', timestamp: '2d ago', likes: 450, comments: 23, shares: 12 },
    { id: 'f5', type: 'new_review', userId: 'dj-39', title: 'Ivan Turanjanin gets a 5-star review!', description: '"An absolutely mind-blowing, raw performance at Mødular. The master at work." The people have spoken!', imageUrl: 'https://picsum.photos/seed/ivan-review/600/400', timestamp: '3d ago', likes: 1500, comments: 99, shares: 60 },
    { id: 'f6', type: 'new_mix', userId: 'dj-4', title: 'New Mix: Dub Echoes Vol. 5', description: '60 minutes of deep, dubby techno. Perfect for a rainy day in the city.', imageUrl: 'https://picsum.photos/seed/sidesmix/600/400', timestamp: '4d ago', likes: 800, comments: 110, shares: 90, relatedId: 'pl4' },
    { id: 'f14', type: 'new_mix', userId: 'dj-2', title: 'Afro House Sunset Mix', description: 'Here is my latest mix for all the sunset chasers. Enjoy!', imageUrl: 'https://picsum.photos/seed/pl2/600/400', timestamp: '3d ago', likes: 2100, comments: 250, shares: 150, relatedId: 'pl2' },
    { id: 'f7', type: 'gig_announcement', userId: 'biz-1', title: 'Open Decks next Wednesday!', description: 'Think you have what it takes? We\'re hosting an open decks night. Come through and show us what you got. Best selector gets a paid gig.', imageUrl: 'https://picsum.photos/seed/opendecks/600/400', timestamp: '5d ago', likes: 800, comments: 150, shares: 50},
    { id: 'f8', type: 'new_track', userId: 'dj-11', title: 'Out Now: "Langa"', description: 'My new EP just dropped on all platforms. This one is for my home. Big love to everyone supporting.', imageUrl: 'https://picsum.photos/seed/pierrejohnson/600/400', timestamp: '5d ago', likes: 2200, comments: 180, shares: 90},
    { id: 'f9', type: 'live_now', userId: 'dj-12', title: 'Leighton Moody is live!', description: 'Sunday vinyl session incoming. Deep and soulful vibes only.', imageUrl: 'https://picsum.photos/seed/leightonlive/600/400', timestamp: '6d ago', likes: 980, comments: 75, shares: 40},
    { id: 'f10', type: 'new_connection', userId: 'biz-23', title: 'Wolfkop Weekender is now following Pierre Johnson', description: 'Looks like a future collaboration might be on the cards!', imageUrl: 'https://picsum.photos/seed/wolfkoppierre/600/400', timestamp: '1w ago', likes: 1100, comments: 40, shares: 20},
    { id: 'f11', type: 'gig_announcement', userId: 'biz-49', title: 'Deep End returns with Sides', description: 'We\'re back in the warehouse on Sept 12. Limited tickets available for this one.', imageUrl: 'https://picsum.photos/seed/deependg10/600/400', timestamp: '1w ago', likes: 600, comments: 55, shares: 35},
    { id: 'f12', type: 'new_mix', userId: 'dj-7', title: 'The Other Side Live Recording', description: 'Here\'s my set from last weekend. All minimal, all groovy.', imageUrl: 'https://picsum.photos/seed/fogshowmix/600/400', timestamp: '1w ago', likes: 1300, comments: 95, shares: 65},
    { id: 'f13', type: 'new_track', userId: 'dj-33', title: 'Chronical Deep - "Karbau"', description: 'New music alert! My track Karbau is officially out. Go stream it and let me know what you think.', imageUrl: 'https://picsum.photos/seed/chronicaldeep/600/400', timestamp: '8d ago', likes: 2500, comments: 250, shares: 120},
];

// --- NOTIFICATIONS ---
let notifications: Notification[] = [
    // For DJ: Double X eL (dj-46)
    { id: 'n1', userId: 'dj-46', type: NotificationType.Message, text: 'Mødular. wants to discuss your availability for a future gig.', timestamp: '1h ago', read: false, relatedId: 'chat-6' },
    { id: 'n2', userId: 'dj-46', type: NotificationType.NewFollower, text: 'Leighton Moody started following you.', timestamp: '1d ago', read: true, relatedId: 'dj-12' },
    { id: 'n3', userId: 'dj-46', type: NotificationType.EventUpdate, text: 'The gig "Dub Techno Special: Sides" has been updated.', timestamp: '3d ago', read: true, relatedId: 'g10' },

    // For Business: Mødular (biz-1)
    { id: 'n4', userId: 'biz-1', type: NotificationType.BookingRequest, text: 'K-DOLLA expressed interest in your gig: "Deep Tech Invites".', timestamp: '5m ago', read: false, relatedId: 'g1' },
    { id: 'n5', userId: 'biz-1', type: NotificationType.BookingRequest, text: 'Pierre Johnson expressed interest in your gig: "Minimal Effort".', timestamp: '2h ago', read: false, relatedId: 'g8' },
    { id: 'n6', userId: 'biz-1', type: NotificationType.NewFollower, text: 'Cape Town Raver started following you.', timestamp: '1d ago', read: true, relatedId: 'listener-1' },

    // For Listener: Cape Town Raver (listener-1)
    { id: 'n7', userId: 'listener-1', type: NotificationType.EventUpdate, text: 'We House Sundays just announced their August lineup!', timestamp: '4h ago', read: false, relatedId: 'g3' },
];

// --- CHATS ---
let nextMessageId = 5;
const chats: Chat[] = [
  { id: 'chat-1', participants: ['dj-1', 'biz-1'], messages: [
      { id: 'm1', senderId: 'biz-1', text: "Hey K-DOLLA, we have an open slot next Friday. Are you available?", timestamp: "1d ago"},
      { id: 'm2', senderId: 'dj-1', text: "Hey! Sounds good. What are the timings and budget?", timestamp: "22h ago"},
  ]},
  { id: 'chat-2', participants: ['dj-1', 'biz-2'], messages: [
      { id: 'm3', senderId: 'biz-2', text: "Love your latest mix! Let us know when you're free for a rooftop set.", timestamp: "3h ago"},
  ]},
  { id: 'chat-3', participants: ['dj-1', 'dj-2'], messages: [
      { id: 'm4', senderId: 'dj-2', text: "Bro your last set was fire.", timestamp: "2d ago"},
  ]},
  { id: 'chat-4', participants: ['dj-11', 'biz-23'], messages: []},
  { id: 'chat-5', participants: ['dj-10', 'biz-9'], messages: []},
  { id: 'chat-6', participants: ['dj-46', 'biz-1'], messages: [
    { id: 'm5', senderId: 'biz-1', text: "Hey Double X, we're big fans of your untitled.deep series. Let's connect about a potential residency.", timestamp: "1h ago"},
  ]},
];

// --- API FUNCTIONS ---
const simulate = <T,>(data: T): Promise<T> => new Promise(res => {
    setTimeout(() => {
        if (typeof data === 'undefined') {
            res(data);
            return;
        }
        // Deep copy to prevent mutation of the mock DB.
        res(JSON.parse(JSON.stringify(data)));
    }, 300);
});


export const getDJs = () => simulate(djs);
export const getDJById = (id: string) => simulate(djs.find(d => d.id === id));
export const getBusinesses = () => simulate(businesses);
export const getBusinessById = (id: string) => simulate(businesses.find(b => b.id === id));
export const getUserById = (id: string) => simulate(allUsers.find(u => u.id === id));
export const getGigById = (id: string) => {
    const gig = gigs.find(g => g.id === id);
    if (!gig) return simulate(undefined);

    const bookedDj = gig.bookedDjId ? djs.find(d => d.id === gig.bookedDjId) : undefined;
    const enrichedGig = {
        ...gig,
        interestCount: interests.filter(i => i.gigId === gig.id).length,
        bookedDjName: bookedDj?.name,
    };
    return simulate(enrichedGig);
}
export const getGigs = () => simulate(gigs);
export const getGigsForVenue = (venueId: string) => {
    const venueGigs = gigs.filter(g => g.venueId === venueId);
    const enrichedGigs = venueGigs.map(gig => {
        const bookedDj = gig.bookedDjId ? djs.find(d => d.id === gig.bookedDjId) : undefined;
        return {
            ...gig,
            interestCount: interests.filter(i => i.gigId === gig.id).length,
            bookedDjName: bookedDj?.name,
        }
    });
    return simulate(enrichedGigs);
};
export const getVenueByGig = (gigId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    return simulate(businesses.find(b => b.id === gig?.venueId));
};
export const getDJByTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return simulate(djs.find(d => d.id === track?.artistId));
}
export const getFeedItems = () => simulate(feedItems.sort((a,b) => 0.5 - Math.random()));

export const addFeedItem = (item: Omit<FeedItem, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => {
    const newFeedItem: FeedItem = {
        ...item,
        id: `f${feedItems.length + 1}`,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
    };
    feedItems.unshift(newFeedItem);
    return simulate(newFeedItem);
}


export const getNotifications = (userId: string) => simulate(notifications.filter(n => n.userId === userId));

export const getPlaylistById = (id: string) => simulate(playlists.find(p => p.id === id));
export const getTracksByIds = (ids: string[]) => simulate(tracks.filter(t => ids.includes(t.id)));
export const getStreamSessionById = (id: string) => simulate(streamSessions.find(s => s.id === id));

export const markAllAsRead = (userId: string) => {
    notifications.forEach(n => {
        if (n.userId === userId) {
            n.read = true;
        }
    });
    return simulate(true);
}

export const getEnrichedChatsForUser = (userId: string): Promise<EnrichedChat[]> => {
    const userChats = chats.filter(c => c.participants.includes(userId));
    const enriched = userChats.map(chat => {
        const otherId = chat.participants.find(p => p !== userId)!;
        const otherParticipant = allUsers.find(u => u.id === otherId)!;
        return { ...chat, otherParticipant };
    }).filter(chat => chat.otherParticipant); // Filter out chats where other participant might not exist
    return simulate(enriched.sort((a,b) => {
        const timeA = a.messages[a.messages.length - 1]?.timestamp ?? 0;
        const timeB = b.messages[b.messages.length - 1]?.timestamp ?? 0;
        if (!timeA) return 1;
        if (!timeB) return -1;
        // Simple sort for demo, not robust for various time formats
        return timeA > timeB ? -1 : 1;
    }));
};

export const getChatById = (chatId: string) => simulate(chats.find(c => c.id === chatId));

export const findChatByParticipants = (userId1: string, userId2: string) => {
    const chat = chats.find(c => c.participants.includes(userId1) && c.participants.includes(userId2));
    return simulate(chat);
};

export const createChat = (userId1: string, userId2: string) => {
    const newChat: Chat = {
        id: `chat-${chats.length + 1}`,
        participants: [userId1, userId2],
        messages: []
    };
    chats.push(newChat);
    return simulate(newChat);
}

export const sendMessage = (chatId: string, senderId: string, text: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
        const newMessage: Message = {
            id: `m${nextMessageId++}`,
            senderId,
            text,
            timestamp: 'Just now'
        };
        chat.messages.push(newMessage);

        const recipientId = chat.participants.find(p => p !== senderId);
        if (recipientId) {
             const sender = allUsers.find(u => u.id === senderId);
             notifications.unshift({
                id: `n${notifications.length + 1}`,
                userId: recipientId,
                type: NotificationType.Message,
                text: `New message from ${sender?.name}`,
                timestamp: 'Just now',
                read: false,
                relatedId: chatId,
             });
        }

        return simulate(newMessage);
    }
    return simulate(null);
};


export const authenticate = (email: string): Promise<User | undefined> => {
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return simulate(undefined);

  // Return the detailed profile based on role
  if (user.role === Role.DJ) {
      return getDJById(user.id);
  }
  if (user.role === Role.Business) {
      return getBusinessById(user.id);
  }
  if (user.role === Role.Listener) {
      return simulate(listeners.find(l => l.id === user.id));
  }
  return simulate(user);
}

export const addGig = (newGig: Omit<Gig, 'id' | 'status'>) => {
    const gig: Gig = {
        ...newGig,
        id: `g${gigs.length + 1}`,
        status: 'Open'
    };
    gigs.unshift(gig);
    return simulate(gig);
}

export const expressInterestInGig = (gigId: string, djId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    const dj = djs.find(d => d.id === djId);
    const venue = businesses.find(b => b.id === gig?.venueId);

    if (gig && dj && venue) {
        // Record the interest
        if (!interests.some(i => i.gigId === gigId && i.djId === djId)) {
            interests.unshift({ gigId, djId, timestamp: new Date().toISOString() });
        }

        // Add notification for the venue
        notifications.unshift({
            id: `n${notifications.length + 1}`,
            userId: venue.id,
            type: NotificationType.BookingRequest,
            text: `${dj.name} expressed interest in your gig: "${gig.title}"`,
            timestamp: 'Just now',
            read: false,
            relatedId: gig.id,
        });
        return simulate(true);
    }
    return simulate(false);
}

export const getInterestedGigsForDj = (djId: string) => {
    const interestedGigIds = interests.filter(i => i.djId === djId).map(i => i.gigId);
    const interestedGigs = gigs.filter(g => interestedGigIds.includes(g.id));
    return simulate(interestedGigs);
};

export const getBookedGigsForDj = (djId: string) => {
    const bookedGigs = gigs.filter(g => g.bookedDjId === djId && g.status === 'Booked');
    return simulate(bookedGigs);
};

export const getCompletedGigsForDj = (djId: string) => {
    const completedGigs = gigs.filter(g => g.bookedDjId === djId && g.status === 'Completed');
    return simulate(completedGigs);
}

export const getInterestedDJsForGig = (gigId: string): Promise<DJ[]> => {
    const interestedDjIds = interests.filter(i => i.gigId === gigId).map(i => i.djId);
    const interestedDjs = djs.filter(d => interestedDjIds.includes(d.id));
    return simulate(interestedDjs);
};

export const bookDJForGig = (gigId: string, djId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    const dj = djs.find(d => d.id === djId);
    const venue = businesses.find(b => b.id === gig?.venueId);

    if (gig && dj && venue) {
        if (gig.status === 'Booked') {
            console.error("Gig is already booked");
            return simulate(false);
        }

        gig.status = 'Booked';
        gig.bookedDjId = dj.id;

        // Notify the booked DJ
        notifications.unshift({
            id: `n${notifications.length + 1}`,
            userId: dj.id,
            type: NotificationType.BookingConfirmed,
            text: `You have been booked for "${gig.title}" at ${venue.venueName}!`,
            timestamp: 'Just now',
            read: false,
            relatedId: gig.id,
        });

        // Notify other applicants
        const allInterestedDjIds = interests.filter(i => i.gigId === gigId).map(i => i.djId);
        allInterestedDjIds.forEach(interestedDjId => {
            if (interestedDjId !== dj.id) {
                notifications.unshift({
                    id: `n${notifications.length + 1}`,
                    userId: interestedDjId,
                    type: NotificationType.GigFilled,
                    text: `The gig "${gig.title}" has been filled. Better luck next time!`,
                    timestamp: 'Just now',
                    read: false,
                    relatedId: gig.id,
                });
            }
        });

        // Remove all interest entries for this gig now that it's booked
        interests = interests.filter(i => i.gigId !== gigId);

        return simulate(true);
    }
    return simulate(false);
};


// Leaderboard Functions
export const getTopDJs = () => simulate(djs.slice().sort((a, b) => b.rating - a.rating));
export const getTopVenues = () => simulate(businesses.slice().sort((a, b) => b.rating - a.rating));

// Social Functions
const findMutableProfile = (userId: string): DJ | Business | Listener | undefined => {
    let user: DJ | Business | Listener | undefined = djs.find(u => u.id === userId);
    if (user) return user;
    user = businesses.find(u => u.id === userId);
    if (user) return user;
    return listeners.find(u => u.id === userId);
}

export const followUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = findMutableProfile(currentUserId);
    const targetUser = allUsers.find(u => u.id === targetUserId);
    
    if(!targetUser) return simulate(false);

    if (currentUser && !currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
        
        const targetProfile = findMutableProfile(targetUserId);
        if (targetProfile) {
            targetProfile.followers++;
        }

        notifications.unshift({
             id: `n${notifications.length + 1}`,
             userId: targetUserId,
             type: NotificationType.NewFollower,
             text: `${currentUser.name} started following you.`,
             timestamp: 'Just now',
             read: false,
             relatedId: currentUserId,
        });
    }
    
    return simulate(true);
}

export const unfollowUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = findMutableProfile(currentUserId);
    const targetUser = findMutableProfile(targetUserId);

    if (currentUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    }
     if (targetUser) {
        targetUser.followers--;
    }
    return simulate(true);
}


export const getFollowersForUser = (userId: string) => {
    const followers = allUsers.filter(u => {
      const profile = findMutableProfile(u.id);
      return profile && profile.following.includes(userId);
    });
    return simulate(followers);
}

export const getFollowingForUser = (userId: string) => {
    const user = findMutableProfile(userId);
    if(user) {
        const followingUsers = user.following.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
        return simulate(followingUsers);
    }
    return simulate([]);
}

export const createStreamSession = (djId: string, title: string) => {
    const newSession: StreamSession = {
        id: `stream-${streamSessions.length + 1}`,
        djId,
        title,
        isLive: true,
        listenerCount: 0,
    };
    streamSessions.push(newSession);
    return simulate(newSession);
};

export const getTracksForDj = (djId: string) => {
    const djTracks = tracks.filter(t => t.artistId === djId);
    return simulate(djTracks);
}

export const getPlaylistsForDj = (djId: string) => {
    const djPlaylists = playlists.filter(p => p.creatorId === djId);
    return simulate(djPlaylists);
}