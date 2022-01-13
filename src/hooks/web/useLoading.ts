import { useAppContainer } from '/@/components/Application';
import { createLoading } from '/@/components/Loading/src/createLoading';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMount } from 'ahooks'

export function useLoading(loading = false) {
  const { app, saveApp } = useAppContainer();
  const { getDarkMode } = useRootSetting();
  useMount(() => {
    if (app.loading) {
      app.loading.setLoading(loading)
      return;
    }
    const loadingUse = createLoading({
      loading,
      theme: getDarkMode()
    })
    saveApp({
      ...app,
      loading: loadingUse,
    })
    loadingUse.setLoading(loading)
  })
  return app.loading;
}
