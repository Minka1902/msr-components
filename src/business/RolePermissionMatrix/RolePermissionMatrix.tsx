import * as React from "react";
import { cx } from "../../lib/cx";
import { Checkbox } from "../../components/Checkbox/Checkbox";

export interface PermissionRole {
  id: string;
  label: string;
}

export interface PermissionRow {
  id: string;
  label: string;
  /** Group/section heading. */
  group?: string;
}

export interface RolePermissionMatrixProps extends Omit<React.HTMLAttributes<HTMLTableElement>, "onChange"> {
  roles: PermissionRole[];
  permissions: PermissionRow[];
  /** Map of `${permissionId}:${roleId}` → granted. */
  value: Record<string, boolean>;
  onChange?: (next: Record<string, boolean>) => void;
  readOnly?: boolean;
}

function key(permId: string, roleId: string) {
  return `${permId}:${roleId}`;
}

/** Editable matrix of permissions × roles (checkbox grid). */
export const RolePermissionMatrix = React.forwardRef<HTMLTableElement, RolePermissionMatrixProps>(
  function RolePermissionMatrix({ roles, permissions, value, onChange, readOnly, className, ...rest }, ref) {
    const toggle = (permId: string, roleId: string) => {
      if (readOnly) return;
      const k = key(permId, roleId);
      onChange?.({ ...value, [k]: !value[k] });
    };

    // Preserve group order.
    const groups: Array<{ name?: string; rows: PermissionRow[] }> = [];
    permissions.forEach((p) => {
      let g = groups.find((x) => x.name === p.group);
      if (!g) { g = { name: p.group, rows: [] }; groups.push(g); }
      g.rows.push(p);
    });

    return (
      <div className={cx("msr-PermMatrix", className)}>
        <table ref={ref} className="msr-PermMatrix__table" {...rest}>
          <thead>
            <tr>
              <th className="msr-PermMatrix__corner">Permission</th>
              {roles.map((r) => (
                <th key={r.id} className="msr-PermMatrix__role">{r.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <React.Fragment key={group.name ?? "_"}>
                {group.name && (
                  <tr className="msr-PermMatrix__group">
                    <td colSpan={roles.length + 1}>{group.name}</td>
                  </tr>
                )}
                {group.rows.map((perm) => (
                  <tr key={perm.id}>
                    <td className="msr-PermMatrix__perm">{perm.label}</td>
                    {roles.map((role) => (
                      <td key={role.id} className="msr-PermMatrix__cell">
                        <Checkbox
                          checked={!!value[key(perm.id, role.id)]}
                          disabled={readOnly}
                          aria-label={`${perm.label} for ${role.label}`}
                          onChange={() => toggle(perm.id, role.id)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);
