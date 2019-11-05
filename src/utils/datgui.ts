export function makeRadioGroupTargetObject(
  props: string[],
  selected: string = ""
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const find = props.find(key => key.toLowerCase() === selected.toLowerCase());

  let _selected = find ? find : "";

  for (const key of props) {
    Object.defineProperty(result, key, {
      get() {
        return key === _selected;
      },
      set(value: boolean) {
        value ? (_selected = key) : (_selected = "");
      }
    });
  }

  return result;
}

export function addRadioGroupOnGUI(
  gui: dat.GUI,
  labels: string[],
  onChange: (value: string) => void,
  selected?: string
): dat.GUI {
  const target = makeRadioGroupTargetObject(labels, selected);

  for (const key of labels) {
    const added = gui.add(target, key);

    added.onChange(() => {
      gui.updateDisplay();
      onChange(key);
    });

    if (target[key]) {
      onChange(key);
    }
  }

  return gui;
}
