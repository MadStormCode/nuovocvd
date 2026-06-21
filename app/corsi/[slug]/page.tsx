'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Calendar, Users, Clock, User, ArrowLeft, CheckCircle,
  Sun, Bed, Star, Shirt, Home, Backpack, ChevronRight, Moon, Coffee,
  UtensilsCrossed, Waves, BookOpen, Music, Trophy, CircleDot
} from 'lucide-react';

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [option, setOption] = useState<'day' | 'campus'>('campus');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('courses').select('*').eq('slug', params.slug).single();
      if (!data) { setLoading(false); return; }
      setCourse(data);
      const { data: weeksData } = await supabase.from('course_weeks').select('*').eq('course_id', data.id).eq('is_active', true).order('week_number', { ascending: true });
      setWeeks(weeksData ?? []);
      setLoading(false);
    }
    load();
  }, [params.slug]);

  if (loading) return <div className="py-20 text-center text-slate-400">Caricamento...</div>;
  if (!course) return notFound();

  const highlights = course.highlights || [];
  const price = option === 'day' ? (course.price_day || 0) : (course.price_campus || 0);
  const dayStart = course.day_start_time || '10:00';
  const dayEnd = course.day_end_time || '17:00';
  const fridayEnd = course.day_friday_end || '17:30';
  const campusNights = course.campus_nights || 5;
  const campusCheckin = course.campus_checkin || 'Domenica 18:00';
  const campusCheckout = course.campus_checkout || 'Venerd' + String.fromCharCode(236) + ' 17:30';

  const daySchedule = [
    { time: dayStart, icon: BookOpen, label: 'Briefing teoria', desc: 'Spiegazione del programma giornaliero e meteo', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { time: '10:30', icon: Waves, label: 'Prima uscita in acqua', desc: 'Esercizi di vela e tecnica con l' + "'" + 'istruttore', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { time: '12:30', icon: UtensilsCrossed, label: 'Pranzo', desc: 'Pranzo al sacco o mensa', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { time: '13:30', icon: Coffee, label: 'Pausa relax', desc: 'Tempo libero per riposare e giocare', color: 'bg-stone-50 border-stone-200 text-stone-700' },
    { time: '14:30', icon: Waves, label: 'Seconda uscita in acqua', desc: 'Esercizi avanzati e regate interne', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { time: dayEnd, icon: Sun, label: 'Rientro e doccia', desc: 'Rientro in base, doccia e cambio', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  ];

  const campusSchedule = [
    { time: '08:00', icon: Coffee, label: 'Colazione', desc: 'Colazione tutti insieme in mensa', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { time: dayStart, icon: BookOpen, label: 'Briefing teoria', desc: 'Spiegazione del programma giornaliero', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { time: '10:30', icon: Waves, label: 'Prima uscita in acqua', desc: 'Esercizi di vela con l' + "'" + 'istruttore', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { time: '12:30', icon: UtensilsCrossed, label: 'Pranzo in mensa', desc: 'Pranzo completo con menu equilibrato', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { time: '14:00', icon: Waves, label: 'Seconda uscita in acqua', desc: 'Esercizi avanzati e regate interne', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { time: dayEnd, icon: Sun, label: 'Rientro e doccia', desc: 'Rientro in base, doccia e cambio', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { time: '17:30', icon: Music, label: 'Attivita ricreative', desc: 'Giochi, sport, laboratori e tempo libero', color: 'bg-violet-50 border-violet-200 text-violet-700' },
    { time: '19:00', icon: Moon, label: 'Cena e serata', desc: 'Cena in compagnia e serata tematica', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  ];

  const schedule = option === 'day' ? daySchedule : campusSchedule;

  return (
    <div>
      <section className="relative h-80 overflow-hidden">
        <Image
          src={course.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920'}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto px-4 lg:px-8">
            <Link href="/corsi">
              <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2">
                <ArrowLeft className="h-4 w-4" /> Torna ai corsi
              </Button>
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-[hsl(199,89%,48%)] text-white">{course.level}</Badge>
              <Badge className="bg-white/90 text-[hsl(210,50%,20%)]">1 settimana</Badge>
              <Badge className="bg-emerald-500/90 text-white">{course.school_period}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{course.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Descrizione</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>

              {highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                    <Star className="h-6 w-6 text-[hsl(199,89%,48%)]" /> Cosa include
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {highlights.map((h: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-[hsl(165,55%,50%)] shrink-0" />
                        <span className="text-sm text-slate-700">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-[hsl(199,89%,48%)]" /> Una giornata tipo
                  <Badge className={option === 'day' ? 'bg-amber-500' : 'bg-[hsl(199,89%,48%)]'}>
                    {option === 'day' ? 'Diurno' : 'Campus'}
                  </Badge>
                </h2>
                <div className="space-y-3">
                  {schedule.map((slot, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${slot.color} transition-all hover:shadow-md`}>
                      <div className="flex flex-col items-center gap-1 min-w-[72px]">
                        <slot.icon className="h-5 w-5" />
                        <span className="text-sm font-bold">{slot.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{slot.label}</div>
                        <div className="text-xs opacity-80">{slot.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {option === 'campus' && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-sm text-indigo-700">
                    <div className="flex items-center gap-2 mb-1"><Moon className="h-4 w-4" /><span className="font-semibold">{campusNights} notti di campus</span></div>
                    <div className="text-xs opacity-80">Da {campusCheckin} a {campusCheckout}. Venerd' + String.fromCharCode(236) + ' tutti concludono alle {fridayEnd}.</div>
                  </div>
                )}
                {option === 'day' && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-700">
                    <div className="flex items-center gap-2 mb-1"><Sun className="h-4 w-4" /><span className="font-semibold">Corso diurno - Lun-Ven</span></div>
                    <div className="text-xs opacity-80">Dalle {dayStart} alle {dayEnd}. Venerd' + String.fromCharCode(236) + ' termina alle {fridayEnd}.</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{course.age_min}-{course.age_max} anni</div>
                    <div className="text-xs text-slate-400">Fascia eta</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">1 settimana</div>
                    <div className="text-xs text-slate-400">Lun-Ven</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <User className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{course.instructor}</div>
                    <div className="text-xs text-slate-400">Istruttore FIV</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Shirt className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">Attrezzatura inclusa</div>
                    <div className="text-xs text-slate-400">{course.gear_included || 'Barca, vela, giubbotto'}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Backpack className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">Cosa portare</div>
                    <div className="text-xs text-slate-400">{course.what_to_bring || 'Costume, crema, asciugamano'}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{option === 'campus' ? 'Campus ' + campusNights + ' notti' : 'Solo diurno'}</div>
                    <div className="text-xs text-slate-400">{option === 'campus' ? 'Check-in ' + campusCheckin : 'Check-out ' + fridayEnd}</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Scegli la tua opzione</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className={`border-0 shadow-md cursor-pointer transition-all ${option === 'day' ? 'ring-2 ring-amber-500 bg-amber-50' : 'opacity-60 hover:opacity-100'}`}
                    onClick={() => setOption('day')}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <h3 className="font-bold text-[hsl(210,50%,20%)]">Corso Diurno</h3>
                        {option === 'day' && <Badge className="bg-amber-500 text-white">Selezionato</Badge>}
                      </div>
                      <p className="text-sm text-slate-500 mb-2">Lun-Ven dalle {dayStart} alle {dayEnd}. Venerd' + String.fromCharCode(236) + ' termina alle {fridayEnd}.</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Ore di vela con istruttore</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Attrezzatura inclusa</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Pranzo al sacco</li>
                        <li className="flex items-center gap-2 text-slate-400 line-through"> Alloggio</li>
                        <li className="flex items-center gap-2 text-slate-400 line-through"> Pasti serali</li>
                        <li className="flex items-center gap-2 text-slate-400 line-through"> Attivita serali</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card
                    className={`border-0 shadow-md border-l-4 border-l-[hsl(199,89%,48%)] cursor-pointer transition-all ${option === 'campus' ? 'ring-2 ring-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/5' : 'opacity-60 hover:opacity-100'}`}
                    onClick={() => setOption('campus')}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Bed className="h-5 w-5 text-[hsl(199,89%,48%)]" />
                        <h3 className="font-bold text-[hsl(210,50%,20%)]">Campus</h3>
                        <Badge className="bg-[hsl(199,89%,48%)] text-white text-xs">Consigliato</Badge>
                        {option === 'campus' && <Badge className="bg-[hsl(199,89%,48%)] text-white">Selezionato</Badge>}
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{campusNights} notti da {campusCheckin} a {campusCheckout}. Venerd' + String.fromCharCode(236) + ' termina alle {fridayEnd}.</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Alloggio in camerate</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Colazione, pranzo e cena</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Attrezzatura inclusa</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Attivita serali</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Assistenza 24h</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Ore di vela</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {(course.discount_family_2nd || course.discount_member || course.discount_isee) && (
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-[hsl(199,89%,48%)]" /> Agevolazioni
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.discount_family_2nd > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CircleDot className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-emerald-800">Sconto famiglia - 2' + String.fromCharCode(176) + ' figlio</div>
                          <div className="text-xs text-emerald-600">-{course.discount_family_2nd}% sul 2' + String.fromCharCode(176) + ' figlio iscritto</div>
                        </div>
                      </div>
                    )}
                    {course.discount_family_3rd > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CircleDot className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-emerald-800">Sconto famiglia - 3' + String.fromCharCode(176) + ' figlio</div>
                          <div className="text-xs text-emerald-600">-{course.discount_family_3rd}% sul 3' + String.fromCharCode(176) + ' figlio e successivi</div>
                        </div>
                      </div>
                    )}
                    {course.discount_member > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <CircleDot className="h-5 w-5 text-blue-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-blue-800">Sconto socio</div>
                          <div className="text-xs text-blue-600">-{course.discount_member}% per soci tesserati</div>
                        </div>
                      </div>
                    )}
                    {course.discount_isee > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-lg border border-violet-200">
                        <CircleDot className="h-5 w-5 text-violet-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-violet-800">Sconto ISEE</div>
                          <div className="text-xs text-violet-600">-{course.discount_isee}% per ISEE &lt; 25.000</div>
                        </div>
                      </div>
                    )}
                    {course.discount_large_family > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <CircleDot className="h-5 w-5 text-amber-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-amber-800">Famiglia numerosa</div>
                          <div className="text-xs text-amber-600">-{course.discount_large_family}% per famiglie numerose</div>
                        </div>
                      </div>
                    )}
                    {course.installment_months > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <CircleDot className="h-5 w-5 text-slate-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-slate-800">Rateizzazione</div>
                          <div className="text-xs text-slate-600">In {course.installment_months} rate senza interessi</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Calendario Settimane</h2>
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Settimana</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Prezzo {option === 'day' ? 'Diurno' : 'Campus'}</TableHead>
                        <TableHead>Posti</TableHead>
                        <TableHead>Stato</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeks.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-medium">Settimana {w.week_number}</TableCell>
                          <TableCell>
                            {new Date(w.start_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - {new Date(w.end_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                          </TableCell>
                          <TableCell className={option === 'day' ? 'text-amber-600 font-medium' : 'text-[hsl(199,89%,48%)] font-medium'}>
                            &euro;{price}
                          </TableCell>
                          <TableCell>{w.spots_booked}/{w.spots_total}</TableCell>
                          <TableCell>
                            <Badge className={w.spots_booked < w.spots_total ? 'bg-emerald-500' : 'bg-red-500'}>
                              {w.spots_booked < w.spots_total ? 'Disponibile' : 'Esaurito'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-24 border-0 shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Scegli la tua opzione</div>
                  </div>
                  <div className="flex rounded-lg overflow-hidden border">
                    <button
                      onClick={() => setOption('day')}
                      className={`flex-1 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${option === 'day' ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Sun className="h-4 w-4" /> Diurno
                    </button>
                    <button
                      onClick={() => setOption('campus')}
                      className={`flex-1 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${option === 'campus' ? 'bg-[hsl(199,89%,48%)] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Bed className="h-4 w-4" /> Campus
                    </button>
                  </div>
                  <div className={`rounded-lg p-4 transition-all ${option === 'day' ? 'bg-amber-50 border border-amber-200' : 'bg-[hsl(199,89%,48%)]/5 border border-[hsl(199,89%,48%)]/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {option === 'day' ? <Sun className="h-4 w-4 text-amber-500" /> : <Bed className="h-4 w-4 text-[hsl(199,89%,48%)]" />}
                      <span className="text-sm font-medium text-[hsl(210,50%,20%)]">{option === 'day' ? 'Corso Diurno' : 'Campus'}</span>
                    </div>
                    <div className={`text-2xl font-bold ${option === 'day' ? 'text-amber-600' : 'text-[hsl(199,89%,48%)]'}`}>
                      &euro;{price}<span className="text-sm font-normal text-slate-400">/settimana</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {option === 'day' ? `Lun-Ven ${dayStart}-${dayEnd}, venerd' + String.fromCharCode(236) + ' ${fridayEnd}` : `${campusNights} notti, check-in ${campusCheckin}`}
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-[hsl(199,89%,48%)] h-2 rounded-full transition-all" style={{ width: `${Math.min((course.current_participants / course.max_participants) * 100, 100)}%` }} />
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    {Math.max(course.max_participants - course.current_participants, 0)} posti rimasti
                  </div>
                  <Link href={`/iscrizioni?type=course&id=${course.id}&option=${option}`}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2" size="lg">
                      Iscriviti al Corso <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {!course.registrations_open && (
                    <p className="text-xs text-center text-red-500">Iscrizioni temporaneamente chiuse</p>
                  )}
                  <div className="text-xs text-slate-400 text-center space-y-1 pt-2 border-t">
                    <div className="flex items-center gap-1 justify-center"><Calendar className="h-3 w-3" /> {course.school_period}</div>
                    <div className="flex items-center gap-1 justify-center"><Users className="h-3 w-3" /> {course.age_min}-{course.age_max} anni</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
