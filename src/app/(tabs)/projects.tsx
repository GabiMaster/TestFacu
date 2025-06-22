import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const projectsData = [
  { name: 'Proyecto Programación 3' },
  { name: 'App Gestion Supermercado' },
  { name: 'GTA VI' },
];

const Projects = () => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Filtrado simple (opcional)
  const filteredProjects = projectsData.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyectos</Text>
      </View>

      {/* Body */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        <TouchableOpacity
          style={styles.newProjectButton}
          onPress={() => router.push({ pathname: '/(main)/new_project', params: { from: 'projects' } })}
        >
          <Text style={styles.newProjectButtonText}>Nuevo Proyecto</Text>
        </TouchableOpacity>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search1" type="ant" size={moderateScale(20)} color={COLOR.icon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor={COLOR.icon}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                inputRef.current?.focus();
              }}
            >
              <Icon name="close" type="ant" size={moderateScale(20)} color={COLOR.icon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Projects List */}
        <View style={styles.projectsList}>
          {filteredProjects.map((project, idx) => (
            <View key={idx} style={styles.projectItem}>
              <View style={styles.projectIconCircle}>
                <Icon name="folder-outline" size={moderateScale(28)} color={COLOR.icon} />
              </View>
              <Text style={styles.projectName}>{project.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(16),
  },
  header: {
    flexDirection: 'row',
    paddingBottom: verticalScale(6),
    paddingTop: verticalScale(32),
    marginBottom: verticalScale(18),
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  newProjectButton: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginBottom: verticalScale(18),
  },
  newProjectButtonText: {
    color: COLOR.primary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(18),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(15),
    marginLeft: scale(8),
  },
  projectsList: {
    gap: verticalScale(12),
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  projectIconCircle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(31),
    backgroundColor: COLOR.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  projectName: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

export default Projects;