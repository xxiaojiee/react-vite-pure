
import { useAppContainer } from '/@/components/Application';
import { createLoading } from '/@/components/Loading/src/createLoading';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMount } from 'ahooks'

export function useLoading(status = false) {
  let loadingUse = null;
  const { app, saveApp } = useAppContainer();
  const { getDarkMode } = useRootSetting();
  if(!app.loading){
    loadingUse = createLoading({
      loading: status,
      theme: getDarkMode()
    })
  }
  useMount(() => {
    if (app.loading) {
      app.loading.setLoading(status)
      return;
    }
    saveApp({
      ...app,
      loading: loadingUse!,
    })
  })
  return app.loading || loadingUse;
}
