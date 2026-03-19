import { View } from "react-native";

export default function SkeletonCard() {
  return (
    <View className="mx-4 mb-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 my-4">
      {/* Header Skeleton */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
        <View className="w-24 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
        <View className="flex-row gap-2">
          <View className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <View className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </View>
      </View>

      {/* Content Skeleton */}
      <View className="px-4 py-3">
        {/* Title */}
        <View className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3" />

        {/* Description */}
        <View className="gap-2 mb-3">
          <View className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded" />
          <View className="w-4/5 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
        </View>

        {/* Stats */}
        <View className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-3">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <View className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <View className="w-12 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
            </View>
            <View className="flex-1 items-center">
              <View className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <View className="w-12 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
            </View>
            <View className="flex-1 items-center">
              <View className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <View className="w-12 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <View className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
            <View className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          </View>
          <View className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded" />
        </View>
      </View>

      {/* Footer Bar */}
      <View className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <View className="w-32 h-3 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
      </View>
    </View>
  );
}
