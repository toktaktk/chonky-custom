[chonky](../README.md) › [Globals](../globals.md) › ["components/external/Dropdown"](_components_external_dropdown_.md)

# Module: "components/external/Dropdown"

## Index

### Interfaces

* [DropdownProps](../interfaces/_components_external_dropdown_.dropdownprops.md)

### Variables

* [Dropdown](_components_external_dropdown_.md#const-dropdown)

## Variables

### `Const` Dropdown

• **Dropdown**: *React.FC‹[DropdownProps](../interfaces/_components_external_dropdown_.dropdownprops.md)›* = React.memo((props) => {
    const { group } = props;

    const [showDropdown, setShowDropdown] = useState(false);

    const hideDropdown = useCallback(() => setShowDropdown(false), [setShowDropdown]);
    const dropdownRef = useClickListener({
        onOutsideClick: hideDropdown,
    });

    const triggerClick = useCallback(() => {
        setShowDropdown(true);
    }, [setShowDropdown]);

    return (
        <div ref={dropdownRef} className="chonky-toolbar-dropdown">
            <ToolbarButton
                text={group.name!}
                active={showDropdown}
                icon={ChonkyIconName.dropdown}
                iconOnRight={true}
                onClick={triggerClick}
            />
            {showDropdown && (
                <div className="chonky-toolbar-dropdown-content">
                    {group.fileActions.map((action) => (
                        <SmartDropdownButton
                            key={`action-button-${action.id}`}
                            fileAction={action}
                        />
                    ))}
                </div>
            )}
        </div>
    );
})

*Defined in [src/components/external/Dropdown.tsx:19](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/components/external/Dropdown.tsx#L19)*