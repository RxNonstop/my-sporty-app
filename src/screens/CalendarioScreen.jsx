import React, { useContext, useState, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { EventoContext } from '../context/EventoContext';
import { CampeonatoContext } from '../context/CampeonatoContext';
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

export default function CalendarioScreen({ navigation }) {
  const { misCampeonatos, campeonatosPublicos } = useContext(CampeonatoContext);
  const { isDarkMode } = useContext(ThemeContext);
  
  const todayDateString = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [currentMonth, setCurrentMonth] = useState(todayDateString.substring(0, 7));

  // Combine and deduplicate championships
  const allEvents = useMemo(() => {
    const combined = [...misCampeonatos, ...campeonatosPublicos];
    const uniqueMap = new Map();
    combined.forEach(event => {
      // Assuming event.fecha_inicio exists and is YYYY-MM-DD
      if (event.id && event.fecha_inicio) {
        uniqueMap.set(event.id, event);
      }
    });
    return Array.from(uniqueMap.values());
  }, [misCampeonatos, campeonatosPublicos]);

  // Create marked dates for Calendar
  const markedDates = useMemo(() => {
    const marks = {};
    allEvents.forEach(event => {
      if (!event.fecha_inicio) return;
      marks[event.fecha_inicio] = {
        marked: true,
        dotColor: '#007bff'
      };
    });
    
    // Override/merge selected day style
    if (marks[selectedDate]) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: '#007bff' };
    } else {
      marks[selectedDate] = { selected: true, selectedColor: '#007bff' };
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
    selectedDayBackgroundColor: '#007bff',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#007bff',
    dayTextColor: isDarkMode ? '#d4d4d4' : '#2d4150',
    textDisabledColor: isDarkMode ? '#404040' : '#d9e1e8',
    dotColor: '#007bff',
    selectedDotColor: '#ffffff',
    arrowColor: '#007bff',
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
   

        <View className="rounded-xl overflow-hidden border border-[#eaeaea] dark:border-neutral-700 mb-6 bg-white dark:bg-neutral-800">
          <Calendar
            onDayPress={handleDayPress}
            onMonthChange={handeMonthChange}
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
                onPress={() => navigation.navigate("FasesCampeonatoScreen", { campeonato: event })}
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
                onPress={() => setSelectedDate(event.fecha_inicio)}
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

