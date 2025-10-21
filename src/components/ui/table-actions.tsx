import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  forceDropdown?: boolean;
}

export function TableActions({
  onView,
  onEdit,
  onDelete,
  viewLabel = "Ver detalles",
  editLabel = "Editar",
  deleteLabel = "Eliminar",
  showView = true,
  showEdit = true,
  showDelete = true,
  forceDropdown = false,
}: TableActionsProps) {
  return (
    <TooltipProvider>
      {!forceDropdown ? (
        /* Desktop: Icon buttons with tooltips */
        <div className="hidden md:flex items-center space-x-1">
          {showView && onView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onView}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{viewLabel}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {showEdit && onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{editLabel}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {showDelete && onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{deleteLabel}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ) : null}

      <div className={forceDropdown ? "block" : "md:hidden"}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {showView && onView && (
              <DropdownMenuItem onClick={onView}>
                <Eye className="w-4 h-4 mr-2" />
                {viewLabel}
              </DropdownMenuItem>
            )}
            {showEdit && onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                {editLabel}
              </DropdownMenuItem>
            )}
            {showDelete && onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteLabel}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
