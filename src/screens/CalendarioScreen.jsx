import React, { useContext, useState, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { EventoContext } from '../context/EventoContext';
import { CampeonatoContext } from '../context/CampeonatoContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import EventCard from '../components/EventCard';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// Sport color mappings
const SPORT_COLORS = {
  futbol: '#22c55e',      // Verde
  fútbol: '#22c55e',
  baloncesto: '#f97316',  // Naranja
  basquetbol: '#f97316',
  básquetbol: '#f97316',
  beisbol: '#3b82f6',     // Azul
  béisbol: '#3b82f6',
  voleibol: '#a855f7',    // Morado
  voley: '#a855f7',
};

const DEFAULT_SPORT_COLOR = '#6366f1';

const getSportColor = (deporte, fallbackDotColor) => {
  if (!deporte) return fallbackDotColor || DEFAULT_SPORT_COLOR;
  const key = deporte.toLowerCase().trim();
  return SPORT_COLORS[key] || fallbackDotColor || DEFAULT_SPORT_COLOR;
};

export default function CalendarioScreen({ navigation }) {
  const { misCampeonatos, campeonatosPublicos } = useContext(CampeonatoContext);
  const { isDarkMode } = useContext(ThemeContext);
  const { usuario } = useContext(AuthContext);
  
  const todayDateString = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [currentMonth, setCurrentMonth] = useState(todayDateString.substring(0, 7));

  // Combine and deduplicate championships
  const allEvents = useMemo(() => {
    const combined = [...misCampeonatos, ...campeonatosPublicos];
    const uniqueMap = new Map();
    combined.forEach(event => {
      if (event.id && event.fecha_inicio) {
        uniqueMap.set(event.id, event);
      }
    });
    return Array.from(uniqueMap.values());
  }, [misCampeonatos, campeonatosPublicos]);

  // Create marked dates for Calendar with sport-specific multi-dots
  const markedDates = useMemo(() => {
    const marks = {};

    allEvents.forEach(event => {
      if (!event.fecha_inicio) return;
      const dateKey = event.fecha_inicio;
      const color = getSportColor(event.deporte, event.dotColor);

      if (!marks[dateKey]) {
        marks[dateKey] = {
          dots: []
        };
      }

      // Avoid duplicate dot colors if multiple events of same sport on same day (max 3 dots)
      const alreadyHasDot = marks[dateKey].dots.some(d => d.color === color);
      if (!alreadyHasDot && marks[dateKey].dots.length < 4) {
        marks[dateKey].dots.push({
          key: `event-${event.id}`,
          color: color,
          selectedDotColor: '#ffffff'
        });
      }
    });
    
    // Override/merge selected day style
    if (marks[selectedDate]) {
      marks[selectedDate] = { 
        ...marks[selectedDate], 
        selected: true, 
        selectedColor: '#2563eb' 
      };
    } else {
      marks[selectedDate] = { 
        selected: true, 
        selectedColor: '#2563eb',
        dots: []
      };
    }
    return marks;
  }, [allEvents, selectedDate]);

  const selectedDayEvents = useMemo(() => {
    return allEvents.filter(event => event.fecha_inicio === selectedDate);
  }, [allEvents, selectedDate]);

  const upcomingEvents = useMemo(() => {
    return allEvents.filter(event => {
      if (!event.fecha_inicio) return false;
      const isStrictlyFuture = event.fecha_inicio > todayDateString;
      const isNotSelectedDay = event.fecha_inicio !== selectedDate;
      return isStrictlyFuture && isNotSelectedDay;
    }).sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));
  }, [allEvents, todayDateString, selectedDate]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handeMonthChange = (month) => {
    setCurrentMonth(month.dateString.substring(0, 7));
  };

  const themeConfig = {
    calendarBackground: isDarkMode ? '#171717' : '#ffffff',
    textSectionTitleColor: isDarkMode ? '#a3a3a3' : '#b6c1cd',
    selectedDayBackgroundColor: '#2563eb',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#2563eb',
    dayTextColor: isDarkMode ? '#d4d4d4' : '#2d4150',
    textDisabledColor: isDarkMode ? '#404040' : '#d9e1e8',
    dotColor: '#2563eb',
    selectedDotColor: '#ffffff',
    arrowColor: '#2563eb',
    monthTextColor: isDarkMode ? '#ffffff' : '#1a1a1a',
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '500',
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#171717" : "#f9fafb" }}>
      <ScrollView style={{ flex: 1 }} className="pt-4 px-5" showsVerticalScrollIndicator={false}>
        
        {/* ── Leyenda de Deportes por Color ── */}
        <View className="flex-row flex-wrap justify-between items-center bg-white dark:bg-neutral-800 p-3 rounded-xl border border-[#eaeaea] dark:border-neutral-700 mb-4 shadow-sm">
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-3 h-3 rounded-full bg-[#22c55e] mr-1.5" />
            <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">Fútbol</Text>
          </View>
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-3 h-3 rounded-full bg-[#f97316] mr-1.5" />
            <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">Baloncesto</Text>
          </View>
          <View className="flex-row items-center mr-2 mb-1">
            <View className="w-3 h-3 rounded-full bg-[#3b82f6] mr-1.5" />
            <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">Béisbol</Text>
          </View>
          <View className="flex-row items-center mb-1">
            <View className="w-3 h-3 rounded-full bg-[#a855f7] mr-1.5" />
            <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">Voleibol</Text>
          </View>
        </View>

        <View className="rounded-xl overflow-hidden border border-[#eaeaea] dark:border-neutral-700 mb-6 bg-white dark:bg-neutral-800 shadow-sm">
          <Calendar
            onDayPress={handleDayPress}
            onMonthChange={handeMonthChange}
            markingType={'multi-dot'}
            markedDates={markedDates}
            theme={themeConfig}
            firstDay={1}
            enableSwipeMonths={true}
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm text-[#8a8a8a] dark:text-neutral-500 font-medium uppercase tracking-wider mb-3">
            Eventos {selectedDate === todayDateString ? "de hoy" : `del ${selectedDate}`}
          </Text>
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map(event => (
              <EventCard 
                key={event.id} 
                evento={event} 
                onPress={() => navigation.navigate("Eventos", { 
                  screen: "FasesCampeonatoScreen",
                  params: {
                    campeonato: event,
                    readOnly: event.propietario_id != usuario?.id 
                  }
                })}
              />
            ))
          ) : (
            <View className="p-6 items-center bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 border-dashed">
              <Text className="text-sm text-[#8a8a8a] dark:text-neutral-400">
                {selectedDate === todayDateString 
                  ? "No hay eventos para hoy." 
                  : "No hay eventos para este día."}
              </Text>
            </View>
          )}
        </View>

        <View className="mb-10">
          <Text className="text-sm text-[#8a8a8a] dark:text-neutral-500 font-medium uppercase tracking-wider mb-3">
            Próximos eventos
          </Text>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <EventCard 
                key={event.id} 
                evento={event} 
                onPress={() => navigation.navigate("Eventos", { 
                  screen: "FasesCampeonatoScreen",
                  params: {
                    campeonato: event,
                    readOnly: event.propietario_id != usuario?.id 
                  }
                })}
              />
            ))
          ) : (
            <View className="p-6 items-center bg-white dark:bg-neutral-800 rounded-xl border border-[#eaeaea] dark:border-neutral-700 border-dashed">
              <Text className="text-sm text-[#8a8a8a] dark:text-neutral-400">No hay eventos próximos.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

