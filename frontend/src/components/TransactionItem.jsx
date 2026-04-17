import React, { useState } from 'react'
import { transactionItemStyles } from '../assets/dummyStyles';
import { colorClasses } from '../assets/color';
import { DollarSign } from 'lucide-react';
const TransactionItem = ({
  transaction,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
  onDelete,
  type = "expense",
  categoryIcons,
  setEditingId,
  amountClass = "font-bold truncate block text-right",
  iconClass = "p-3 rounded-xl flex-shrink-0",
}) => {
  const [errors, setErrors] = useState({ description: "", amount: "" });

  const classes = colorClasses[type];
  const sign = type === "income" ? "+" : "-";

  const validate = () => {
    const nextErrors = { description: "", amount: "" };
    const desc = String(editForm.description ?? "").trim();
    const amtRaw = editForm.amount;
    const amt = amtRaw === "" || amtRaw === null || amtRaw === undefined ? "" : String(amtRaw).trim();

    if (!desc) {
      nextErrors.description = "Description is required.";
    }

    if (amt === "") {
      nextErrors.amount = "Amount is required.";
    }  else if (Number(amt) <= 0) {
      nextErrors.amount = "Amount must be greater than 0.";
    }

    setErrors(nextErrors);
    return !nextErrors.description && !nextErrors.amount;
  };

  const handleSaveClick = () => {
    if (validate()) {
      setErrors({ description: "", amount: "" });
      onSave();
    }
  }; // to save the desc and amt
  return (
    <div className={transactionItemStyles.container(isEditing,classes)}>
      <div className={transactionItemStyles.mainContainer}>
        <div className={transactionItemStyles.iconContainer(iconClass,classes)}>
          {categoryIcons[transaction.category] || (
            <DollarSign className='w-5 h-5' />
          )}
        </div>
        <div className={transactionItemStyles.contentContainer}>
          {isEditing ? (
            <>
            <input type='text' value={editForm.description} onChange={(e) => setEditForm((prev) => ({
              ...prev,
              description : e.target.value
            }))} className={transactionItemStyles.input(
              !!errors.description,
              classes
            )} />
            {errors.description && (
              <p className={transactionItemStyles.errorText} id={`desc-error-${transaction.id}`}>
                {errors.description}
              </p>
            )}
            </>
          ) : (
            <p className=''></p>
          )}

        </div>
      </div>
    </div>
  )
}

export default TransactionItem