/**
 * Busca - Tela de pesquisa com filtro e lista de resultados
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { searchItems } from '../../services/searchIndex';
import { spacing } from '../../styles/spacing';
import { headerStyles } from '../../styles/headerStyles';
import { Icon, SafeScreen } from '../../components/ui';

export const BuscaScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const userType = user?.type === 'teacher' ? 'teacher' : 'student';

  const performSearch = useCallback(
    (q) => {
      const items = searchItems(q, userType);
      setResults(items);
    },
    [userType]
  );

  const handleSearchChange = (text) => {
    setQuery(text);
    performSearch(text);
  };

  const handleSelectItem = (item) => {
    Keyboard.dismiss();
    let screen = item.screen;
    if (userType === 'teacher') {
      if (screen === 'Perfil') screen = 'TeacherPerfil';
      if (screen === 'StudentHome') screen = 'TeacherHome';
    }
    const params = { highlightItem: item.title };
    if (item.isTab) {
      navigation.navigate('Main', { screen, params });
    } else {
      navigation.navigate(screen, params);
    }
  };

  const hasSearched = query.length > 0;
  const isEmpty = hasSearched && results.length === 0;

  return (
    <SafeScreen edges={['top']}>
      <View style={[headerStyles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={headerStyles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Busca</Text>
        <View style={headerStyles.menuBtn} />
      </View>

      <View style={[styles.searchSection, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Icon name="search" size={22} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar no sistema..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={handleSearchChange}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Icon name="close-circle" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => setShowAdvanced(!showAdvanced)}
          activeOpacity={0.7}
        >
          <Icon name="filter" size={20} color={theme.primary} />
          <Text style={[styles.filterText, { color: theme.text }]}>
            Filtro avançado
          </Text>
          <Icon
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
        {showAdvanced && (
          <View style={[styles.advancedPanel, { backgroundColor: theme.surface }]}>
            <Text style={[styles.advancedText, { color: theme.textSecondary }]}>
              Opções de filtro em breve
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={[styles.resultsContainer, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.resultsContent}
        keyboardShouldPersistTaps="handled"
      >
        {!hasSearched ? (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Icon name="search" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Sem resultado
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Digite algo para buscar no sistema
            </Text>
          </View>
        ) : isEmpty ? (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Icon name="document-text-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nada encontrado
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Nenhum resultado para "{query}"
            </Text>
          </View>
        ) : (
          results.map((item) => (
            <TouchableOpacity
              key={`${item.screen}-${item.title}`}
              style={[styles.resultCard, { backgroundColor: theme.surface }]}
              onPress={() => handleSelectItem(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.resultIcon, { backgroundColor: theme.primary + '18' }]}>
                <Icon name={item.icon} size={24} color={theme.primary} />
              </View>
              <View style={styles.resultContent}>
                <Text style={[styles.resultTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.resultSubtitle, { color: theme.textSecondary }]} numberOfLines={2}>
                  {item.subtitle}
                </Text>
              </View>
              <Icon name="chevron-forward" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 18, fontWeight: '600' },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  advancedPanel: {
    marginTop: spacing.sm,
    padding: spacing.base,
    borderRadius: 8,
  },
  advancedText: { fontSize: 14 },
  resultsContainer: { flex: 1 },
  resultsContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  resultContent: { flex: 1, minWidth: 0 },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    borderRadius: 12,
    marginTop: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.base,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
